import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (!id) {
            return new Response("No ID provided", { status: 200 });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const accessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");

        // Only process payment topic
        if (topic === "payment") {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const payment = await response.json();
            const orderId = payment.external_reference;

            if (orderId && (payment.status === "approved" || payment.status === "authorized")) {
                // 1. Update order status
                const { data: order, error: orderError } = await supabase
                    .from("orders")
                    .update({
                        status: "Pago",
                        payment_status_detail: payment.status_detail,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", orderId)
                    .select()
                    .single();

                if (orderError) throw orderError;

                // 2. Check if it's a consortium item and add to group if needed
                // (This logic would be triggered here in a real scenario)
                console.log(`Pagamento aprovado para o pedido: ${orderId}`);
            }
        }

        return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error.message);
        return new Response(error.message, { status: 400 });
    }
});
