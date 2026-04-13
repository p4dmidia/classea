import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { orderId, paymentMethod, customerCpf } = await req.json();

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Get order details
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .or(`id.eq.${orderId},id.eq.#${orderId.replace(/^#/, "")}`)
            .single();

        if (orderError || !order) {
            console.error("Order search error:", orderError);
            throw new Error(`Pedido ${orderId} não encontrado no banco de dados.`);
        }

        // 2. Get organization credentials
        const { data: org, error: orgError } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", order.organization_id)
            .single();

        const accessToken = org?.mercadopago_access_token || (org?.mercadopago_config as any)?.access_token;

        if (orgError || !accessToken) {
            console.error(`MP Credentials missing for org ${order.organization_id}:`, orgError);
            throw new Error("Configuração do Mercado Pago não encontrada. Verifique o Access Token da organização.");
        }

        if (paymentMethod === "pix") {
            // Create PIX payment directly
            const customerFirstName = order.customer_name?.split(" ")[0] || "Cliente";
            const customerLastName = order.customer_name?.split(" ").slice(1).join(" ") || "Classe A";
            const cleanCpf = (customerCpf || order.customer_cpf || "").replace(/\D/g, "");

            if (!cleanCpf || cleanCpf.length !== 11) {
                throw new Error("CPF inválido ou incompleto. O Mercado Pago exige um CPF válido para pagamentos PIX.");
            }

            const paymentData = {
                transaction_amount: Number(order.total_amount),
                description: `Pedido ${order.id} - ${org?.name || "Classe A"}`,
                payment_method_id: "pix",
                installments: 1,
                payer: {
                    email: order.customer_email || "cliente@mercado.com",
                    first_name: customerFirstName,
                    last_name: customerLastName,
                    identification: {
                        type: "CPF",
                        number: cleanCpf
                    }
                },
                external_reference: order.id,
                notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook?org_id=${order.organization_id}`,
            };

            const response = await fetch("https://api.mercadopago.com/v1/payments", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Idempotency-Key": `pix-${order.id}-${Date.now()}`
                },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                console.error("Full MP Error Response:", JSON.stringify(result, null, 2));
                const mpErrorMessage = result.message || (result.cause?.[0]?.description) || "Erro desconhecido no Mercado Pago";
                throw new Error(`Mercado Pago: ${mpErrorMessage}`);
            }

            // Safety check for response structure
            const transactionData = result.point_of_interaction?.transaction_data;
            if (!transactionData) {
                console.error("MP Result missing point_of_interaction:", result);
                throw new Error("Estrutura de resposta do PIX inválida vinda do Mercado Pago.");
            }

            // Update order with payment ID and PIX details
            const { error: updateError } = await supabase
                .from("orders")
                .update({ 
                    payment_id: result.id.toString(),
                    pix_qr_code: transactionData.qr_code,
                    pix_qr_code_base64: transactionData.qr_code_base64,
                    pix_copy_paste: transactionData.qr_code,
                    status: 'Pendente' // Garantir que está como pendente
                })
                .eq("id", order.id);

            if (updateError) {
                console.error("Error updating order with PIX data:", updateError);
            }

            return new Response(
                JSON.stringify({
                    qr_code: transactionData.qr_code,
                    qr_code_base64: transactionData.qr_code_base64,
                    copy_paste: transactionData.qr_code,
                    payment_id: result.id,
                    ticket_url: transactionData.ticket_url
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );

        } else {
            // Create Checkout Pro Preference for Credit Card
            const preferenceData = {
                items: order.order_items.map((item: any) => ({
                    title: item.product_name,
                    quantity: item.quantity,
                    unit_price: Number(item.unit_price),
                    currency_id: "BRL",
                })),
                payer: {
                    email: order.customer_email || "cliente@mercado.com",
                },
                external_reference: order.id,
                back_urls: {
                    success: `${req.headers.get("origin") || "https://classea.vercel.app"}/checkout/success`,
                    failure: `${req.headers.get("origin") || "https://classea.vercel.app"}/checkout`,
                    pending: `${req.headers.get("origin") || "https://classea.vercel.app"}/checkout`,
                },
                auto_return: "approved",
                notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook?org_id=${order.organization_id}`,
            };

            // Add shipping cost if present
            if (Number(order.shipping_cost) > 0) {
                preferenceData.items.push({
                    title: "Custo de Envio (Frete)",
                    quantity: 1,
                    unit_price: Number(order.shipping_cost),
                    currency_id: "BRL",
                });
            }

            const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferenceData),
            });

            const result = await response.json();

            if (!result.id || !result.init_point) {
                console.error("MP Preference Error:", result);
                throw new Error(result.message || "Erro ao criar preferência de pagamento");
            }

            // Update order with preference ID
            await supabase
                .from("orders")
                .update({ payment_preference_id: result.id })
                .eq("id", order.id);

            return new Response(
                JSON.stringify({ id: result.id, init_point: result.init_point }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Edge Function Main Catch:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
