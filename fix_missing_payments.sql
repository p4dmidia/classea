-- SCRIPT DE CORREÇÃO DE PAGAMENTOS - CLASSE A
-- Execute este script no SQL Editor do seu painel Supabase para liberar o saldo dos pedidos que já foram pagos.

-- 1. Garantir que a coluna de status de pagamento existe
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT;

-- 2. Marcar os pedidos como PAGOS e ajustar o status visual
-- Importante: A mudança para status = 'Pago' dispara automaticamente o sistema de comissões.
UPDATE public.orders 
SET 
  status = 'Pago', 
  payment_status = 'paid',
  updated_at = now()
WHERE id IN ('#ORD-518', '#ORD-787');

-- NOTA: Se houver outros pedidos que você confirmou o pagamento no Mercado Pago mas aparecem como Cancelado/Pendente, 
-- basta adicionar o ID deles na lista acima entre aspas simples, separados por vírgula (ex: '#ORD-123', '#ORD-456').

-- 3. Script para verificar o novo faturamento total (opcional)
-- SELECT SUM(total_amount) FROM public.orders WHERE status = 'Pago';
