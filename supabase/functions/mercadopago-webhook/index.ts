import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const url = new URL(req.url);
        // MP sends notifications via 'topic' and 'id', or 'type' and 'data.id'
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        console.log(`[Webhook] Recebida notificação: topic=${topic}, id=${id}`);

        if (!id) {
            return new Response("No ID provided", { status: 200 });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const orgId = url.searchParams.get("org_id");
        if (!orgId) {
            console.error("[Webhook] org_id não fornecido na URL.");
            return new Response("org_id missing", { status: 400 });
        }

        // Fetch organization token
        const { data: org, error: orgError } = await supabase
            .from("organizations")
            .select("mercadopago_config")
            .eq("id", orgId)
            .single();

        const config = org?.mercadopago_config as any;
        if (orgError || !config?.access_token) {
            console.error(`[Webhook] Token não encontrado para org ${orgId}:`, orgError);
            return new Response("Organization token not found", { status: 404 });
        }

        const accessToken = config.access_token;

        // Only process payment notifications
        if (topic === "payment" || topic === "merchant_order") {
            let paymentId = id;
            
            // If it's a merchant_order, we might need to get the payment from it
            // but for simplicity and common PIX/Credit cases, we focus on 'payment'
            if (topic === "payment") {
                const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[Webhook] Erro ao buscar pagamento no MP: ${errorText}`);
                    return new Response("Error fetching payment", { status: 200 }); // Return 200 to stop MP retries if it's a permanent error
                }

                const payment = await response.json();
                const orderId = payment.external_reference;
                const status = payment.status;
                const statusDetail = payment.status_detail;

                console.log(`[Webhook] Pedido: ${orderId}, Status MP: ${status}, Detalhe: ${statusDetail}`);

                if (orderId && (status === "approved" || status === "authorized")) {
                    // Update order status to Pago
                    const { data: order, error: orderError } = await supabase
                        .from("orders")
                        .update({
                            status: "Pago",
                            payment_status: 'paid',
                            payment_id: payment.id.toString(),
                            payment_status_detail: statusDetail,
                            updated_at: new Date().toISOString()
                        })
                        .eq("id", orderId)
                        .select()
                        .maybeSingle();

                    if (orderError) {
                        console.error(`[Webhook] Erro ao atualizar pedido ${orderId}:`, orderError);
                        throw orderError;
                    }

                    if (!order) {
                        console.warn(`[Webhook] Pedido ${orderId} não encontrado no banco de dados.`);
                    } else {
                        console.log(`[Webhook] Pedido ${orderId} atualizado para 'Pago' com sucesso.`);
                    }
                } else if (orderId) {
                    console.log(`[Webhook] Pagamento para o pedido ${orderId} ainda não aprovado (Status: ${status}).`);
                }
            }
        }

        return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error("[Webhook Error]:", error.message);
        // Important: Still return a 200 for some errors to prevent MP from retrying infinitely 
        // if the error is deterministic (like order not found), but 400 helps seeing logs in MP dashboard.
        return new Response(error.message, { status: 400 });
    }
});
