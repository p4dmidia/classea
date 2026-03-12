import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MELHOR_ENVIO_TOKEN = Deno.env.get('MELHOR_ENVIO_TOKEN')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!MELHOR_ENVIO_TOKEN) {
            console.error('ERRO: MELHOR_ENVIO_TOKEN não configurado nas variáveis de ambiente.');
            return new Response(
                JSON.stringify({ error: 'Configuração do servidor incompleta (Token de API ausente)' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const body = await req.json().catch(() => ({}));
        const { zip, items } = body;

        if (!zip || !items || !items.length) {
            return new Response(
                JSON.stringify({ error: 'CEP de destino e itens são obrigatórios' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Buscar detalhes dos produtos
        const productIds = items.map((item: any) => item.id)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, weight, length, width, height, origin_zip, price')
            .in('id', productIds)

        if (productsError || !products) {
            throw new Error('Erro ao buscar produtos: ' + productsError?.message)
        }

        // 2. Agrupar produtos por CEP de origem
        const groups: { [key: string]: any[] } = {}
        products.forEach(p => {
            const cartItem = items.find((i: any) => i.id === p.id)
            const groupKey = p.origin_zip || '82820-160' // Default fallback
            if (!groups[groupKey]) groups[groupKey] = []

            groups[groupKey].push({
                id: p.id,
                width: p.width || 11,
                height: p.height || 2,
                length: p.length || 16,
                weight: p.weight || 0.5,
                insurance_value: p.price,
                quantity: cartItem.quantity
            })
        })

        // 3. Calcular frete para cada grupo (origem)
        const shippingPromises = Object.keys(groups).map(async (originZip) => {
            const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
                    'User-Agent': 'ClasseA Integration (agenciap4d@gmail.com)'
                },
                body: JSON.stringify({
                    from: { postal_code: originZip.replace(/\D/g, '') },
                    to: { postal_code: zip.replace(/\D/g, '') },
                    products: groups[originZip]
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`Erro API Melhor Envio (Origem ${originZip}):`, errorText)
                return []
            }

            return await response.json()
        })

        const allResults = await shippingPromises
        const flatResults = await Promise.all(allResults)

        // 4. Consolidar resultados
        // Se houver apenas uma origem, retornamos os resultados diretamente
        if (Object.keys(groups).length === 1) {
            const validResults = flatResults[0].filter((s: any) => !s.error)
            return new Response(
                JSON.stringify(validResults),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Se houver múltiplas origens, precisamos somar os fretes por modalidade (ou simplificar)
        // Para simplificar esta primeira versão, vamos agrupar por nome de serviço e empresa
        const consolidated: { [key: string]: any } = {}

        flatResults.forEach((originResult, index) => {
            originResult.forEach((service: any) => {
                if (service.error) return

                const key = `${service.company.name} - ${service.name}`
                if (!consolidated[key]) {
                    consolidated[key] = {
                        id: service.id,
                        name: service.name,
                        price: 0,
                        delivery_time: 0,
                        company: service.company,
                        custom_delivery_time: 0
                    }
                }

                consolidated[key].price += parseFloat(service.price)
                // O tempo de entrega será o maior entre as origens
                consolidated[key].delivery_time = Math.max(consolidated[key].delivery_time, service.delivery_time)
            })
        })

        // Converter objeto de volta para array e filtrar apenas serviços que atendem TODAS as origens
        const finalResults = Object.values(consolidated).filter(s => {
            // Opcional: verificar se este serviço está presente em todos os flatResults
            // Por agora, vamos retornar o que foi somado
            return true
        })

        return new Response(
            JSON.stringify(finalResults),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
