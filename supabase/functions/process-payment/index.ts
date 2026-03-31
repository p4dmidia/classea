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
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            throw new Error("Pedido não encontrado");
        }

        // 2. Get organization credentials (Dual Mode Support)
        const { data: org, error: orgError } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", order.organization_id)
            .single();

        const accessToken = org?.mercadopago_access_token || (org?.mercadopago_config as any)?.access_token;

        if (orgError || !accessToken) {
            console.error(`MP Credentials missing for org ${order.organization_id}:`, orgError);
            throw new Error("Configuração do Mercado Pago não encontrada para esta organização. Por favor, contate o administrador.");
        }

        if (paymentMethod === "pix") {
            // Create PIX payment directly
            const customerFirstName = order.customer_name?.split(" ")[0] || "Cliente";
            const customerLastName = order.customer_name?.split(" ").slice(1).join(" ") || "Classe A";

            const paymentData = {
                transaction_amount: order.total_amount,
                description: `Pedido ${order.id} - Classe A`,
                payment_method_id: "pix",
                payer: {
                    email: order.customer_email || "cliente@classea.com",
                    first_name: customerFirstName,
                    last_name: customerLastName,
                    identification: {
                        type: "CPF",
                        number: customerCpf ? customerCpf.replace(/\D/g, "") : (order.customer_cpf ? order.customer_cpf.replace(/\D/g, "") : "")
                    }
                },
                external_reference: order.id,
                notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook?org_id=${order.organization_id}`,
            };

            console.log("Full MP Request Payload:", JSON.stringify(paymentData, null, 2));

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

            if (!response.ok || result.error || result.status === 400 || result.status === 401) {
                console.error("Full MP Error Response:", JSON.stringify(result, null, 2));
                const mpErrorMessage = result.message || (result.cause ? result.cause[0].description : "Erro desconhecido no Mercado Pago");
                throw new Error(mpErrorMessage);
            }

            // Update order with payment ID
            await supabase
                .from("orders")
                .update({ payment_id: result.id.toString() })
                .eq("id", orderId);

            return new Response(
                JSON.stringify({
                    qr_code: result.point_of_interaction.transaction_data.qr_code,
                    qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64,
                    copy_paste: result.point_of_interaction.transaction_data.qr_code,
                    payment_id: result.id
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
                    email: order.customer_email || "cliente@classea.com",
                },
                external_reference: order.id,
                back_urls: {
                    success: "https://classea.vercel.app/dashboard",
                    failure: "https://classea.vercel.app/checkout",
                    pending: "https://classea.vercel.app/dashboard",
                },
                auto_return: "approved",
                notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook?org_id=${order.organization_id}`,
            };

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
                .eq("id", orderId);

            return new Response(
                JSON.stringify({ id: result.id, init_point: result.init_point }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
