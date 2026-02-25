
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
    ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [acceptedConsorcio, setAcceptedConsorcio] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');

    // MOCKED CART: Forcing a Consortium product to trigger the rule
    const cart = [
        { id: 1, name: 'Cota de Consórcio Imobiliário Classe A', price: 1250.00, quantity: 1, category: 'Consórcio' },
        { id: 2, name: 'Travesseiro Ortopédico ErgoSoft', price: 280.00, quantity: 1, category: 'Acessórios' }
    ];

    const isConsorcioInCart = cart.some(item => item.category === 'Consórcio');
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 25.00;
    const total = subtotal + shipping;

    const handleConfirmOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConsorcioInCart && !acceptedConsorcio) {
            alert('Para prosseguir com a compra de Consórcio, você deve aceitar os termos de adesão.');
            return;
        }
        alert('Pedido realizado com sucesso!');
        navigate('/');
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
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                                <ShoppingCart className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#0B1221] leading-tight">{item.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category} • Qtd: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[#0B1221]">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-[#0B1221] mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-[#FBC02D]" />
                                Pagamento
                            </h3>
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
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Este pedido contém cota de consórcio. Leia e aceite os termos para finalizar.</p>
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
                                className="w-full mt-10 py-5 bg-[#FBC02D] text-[#0B1221] rounded-2xl font-black text-sm shadow-xl shadow-[#FBC02D]/10 hover:shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                FINALIZAR PAGAMENTO
                                <ArrowRight className="w-5 h-5" />
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
