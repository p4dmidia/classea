
import React, { useState } from 'react';
import {
    ShieldCheck,
    ShoppingCart,
    CreditCard,
    Truck,
    Lock,
    CheckCircle2,
    AlertCircle,
    FileText,
    ArrowRight,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, removeFromCart, clearCart } = useCart();
    const [acceptedConsorcio, setAcceptedConsorcio] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
    const [isLoading, setIsLoading] = useState(false);
    const [pixData, setPixData] = useState<any>(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: ''
    });

    const isConsorcioInCart = cart.some(item => item.category === 'Consórcio');
    const subtotal = cartTotal;
    const shipping = cart.length > 0 ? 25.00 : 0;
    const total = subtotal + shipping;

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.cpf) {
            toast.error('Por favor, preencha todos os dados de envio e o CPF.');
            return;
        }

        if (isConsorcioInCart && !acceptedConsorcio) {
            toast.error('Para prosseguir com a compra de Consórcio, você deve aceitar os termos de adesão.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create order in Supabase
            const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    id: orderId,
                    customer_name: customerInfo.name,
                    customer_email: customerInfo.email,
                    customer_phone: customerInfo.phone,
                    customer_cpf: customerInfo.cpf,
                    shipping_address: customerInfo.address,
                    total_amount: total,
                    status: 'Pendente',
                    payment_method: paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Pix'
                }]);

            if (orderError) throw orderError;

            // 2. Add items
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(cart.map(item => ({
                    order_id: orderId,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price
                })));

            if (itemsError) throw itemsError;

            // 3. Process Payment via Edge Function
            const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('process-payment', {
                body: { orderId, paymentMethod, customerCpf: customerInfo.cpf }
            });

            if (paymentError) throw paymentError;

            if (paymentMethod === 'pix') {
                setPixData(paymentResult);
                toast.success('PIX gerado com sucesso!');
            } else {
                // Checkout Pro Redirect
                window.location.href = paymentResult.init_point;
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error('Erro ao processar pedido: ' + (error.message || 'Tente novamente.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans pb-32">
            {/* Simple Header */}
            <header className="bg-white border-b border-slate-100 py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link to="/shop" className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-[#0B1221] transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        VOLTAR PARA LOJA
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Checkout Seguro</p>
                            <p className="text-sm font-black text-[#0B1221]">CLASSE A PLATINUM</p>
                        </div>
                        <ShieldCheck className="w-8 h-8 text-[#FBC02D]" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

                    {/* Left: Cart & Info */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Cart Summary */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-[#0B1221] mb-8 flex items-center gap-3">
                                <ShoppingCart className="w-6 h-6 text-[#FBC02D]" />
                                Seu Carrinho
                            </h3>
                            <div className="space-y-6">
                                {cart.length > 0 ? cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center text-slate-300">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingCart className="w-8 h-8" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#0B1221] leading-tight line-clamp-1">{item.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category} • Qtd: {item.quantity}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-2 hover:text-red-600 transition-colors"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[#0B1221]">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 font-bold">Seu carrinho está vazio.</p>
                                        <Link to="/shop" className="text-[#FBC02D] font-black text-xs uppercase mt-4 inline-block tracking-widest">Ir para a loja</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-[#0B1221] mb-8 flex items-center gap-3">
                                <Truck className="w-6 h-6 text-[#FBC02D]" />
                                Dados de Envio
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#FBC02D]"
                                        placeholder="Seu nome"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">E-mail</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#FBC02D]"
                                        placeholder="seu@email.com"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#FBC02D]"
                                        placeholder="(00) 00000-0000"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">CPF (Necessário para PIX)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#FBC02D]"
                                        placeholder="000.000.000-00"
                                        value={customerInfo.cpf}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, cpf: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Endereço Completo</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#FBC02D]"
                                        placeholder="Rua, Número, Bairro, Cidade - UF"
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-[#0B1221] mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-[#FBC02D]" />
                                Pagamento
                            </h3>
                            {pixData ? (
                                <div className="text-center space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl inline-block">
                                        <img src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} alt="PIX QR Code" className="w-48 h-48 mx-auto" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-slate-600">Escaneie o QR Code ou copie a chave abaixo:</p>
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={pixData.copy_paste}
                                                className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-mono flex-grow outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixData.copy_paste);
                                                    toast.success('Código PIX copiado!');
                                                }}
                                                className="bg-[#0B1221] text-white px-4 rounded-xl text-[10px] font-black uppercase"
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Aguardando confirmação do pagamento...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('credit')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'credit' ? 'border-[#FBC02D] bg-amber-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <CreditCard className={`w-8 h-8 ${paymentMethod === 'credit' ? 'text-[#FBC02D]' : 'text-slate-300'}`} />
                                        <span className="text-xs font-black uppercase tracking-widest">Cartão de Crédito</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('pix')}
                                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'pix' ? 'border-[#FBC02D] bg-amber-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className={`w-8 h-8 flex items-center justify-center font-black rounded-lg ${paymentMethod === 'pix' ? 'bg-[#FBC02D] text-[#0B1221]' : 'bg-slate-100 text-slate-300'}`}>PIX</div>
                                        <span className="text-xs font-black uppercase tracking-widest">Pix (5% OFF)</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary & Rules */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Totals */}
                        <div className="bg-[#0B1221] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-[#0B1221]/20 relative overflow-hidden">
                            <h3 className="text-xl font-black mb-8">Resumo do Pedido</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-400 text-sm font-medium">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm font-medium">
                                    <span>Entrega</span>
                                    <span>R$ {shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="font-black">TOTAL</span>
                                    <span className="text-2xl font-black text-[#FBC02D]">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* CONSORCIO SPECIFIC RULE */}
                            {isConsorcioInCart && (
                                <div className="bg-white/5 border border-[#FBC02D]/30 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#FBC02D] rounded-xl text-[#0B1221]">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm text-[#FBC02D]">Regras do Consórcio</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                                Este pedido contém cota de consórcio. <Link to="/consorcio/termos" target="_blank" className="text-[#FBC02D] hover:underline">Clique aqui para ler os termos</Link> e aceite abaixo para finalizar.
                                            </p>
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-4 cursor-pointer group mt-4">
                                        <div
                                            onClick={() => setAcceptedConsorcio(!acceptedConsorcio)}
                                            className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${acceptedConsorcio ? 'bg-[#FBC02D] border-[#FBC02D]' : 'border-white/20'}`}
                                        >
                                            {acceptedConsorcio && <CheckCircle2 className="w-4 h-4 text-[#0B1221]" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest leading-relaxed">
                                            Declaro estar ciente das normas de contemplação por sorteio ou lance e aceito os termos do contrato de adesão.
                                        </span>
                                    </label>
                                </div>
                            )}

                            <button
                                onClick={handleConfirmOrder}
                                disabled={isLoading || (paymentMethod === 'pix' && pixData)}
                                className="w-full mt-10 py-5 bg-[#FBC02D] text-[#0B1221] rounded-2xl font-black text-sm shadow-xl shadow-[#FBC02D]/10 hover:shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        PROCESSANDO...
                                    </>
                                ) : paymentMethod === 'pix' && pixData ? (
                                    'PAGAMENTO PENDENTE'
                                ) : (
                                    <>
                                        FINALIZAR PAGAMENTO
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Badges */}
                        <div className="flex flex-col gap-4 px-4">
                            <div className="flex items-center gap-3 text-slate-400">
                                <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Pagamento Criptografado</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Garantia Classe A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
