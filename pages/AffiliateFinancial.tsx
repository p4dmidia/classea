
import React, { useState, useEffect } from 'react';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    CreditCard,
    PlusCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCcw
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

interface Withdrawal {
    id: number;
    amount_requested: number;
    net_amount: number;
    status: string;
    pix_key: string;
    created_at: string;
}

const AffiliateFinancial: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showPixModal, setShowPixModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [newPixKey, setNewPixKey] = useState('');

    // Financial Data States
    const [balance, setBalance] = useState({
        total: 0,
        available: 0,
        frozen: 0,
        withdrawn: 0
    });
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [pixKey, setPixKey] = useState('Não cadastrada');

    useEffect(() => {
        if (user) {
            fetchFinancialData();
        }
    }, [user]);

    const fetchFinancialData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Balances (user_settings)
            const { data: settings, error: settingsError } = await supabase
                .from('user_settings')
                .select('available_balance, frozen_balance, total_earnings, pix_key')
                .eq('user_id', user?.id)
                .single();

            if (settingsError) throw settingsError;

            // 2. Fetch Withdrawal History
            const { data: withdrawData, error: withdrawError } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (withdrawError) throw withdrawError;

            // 3. Calculate Withdrawn amount
            const totalWithdrawn = (withdrawData || [])
                .filter(w => w.status === 'completed' || w.status === 'paid' || w.status === 'Pago')
                .reduce((acc, curr) => acc + Number(curr.amount_requested), 0);

            setBalance({
                total: Number(settings.total_earnings || 0),
                available: Number(settings.available_balance || 0),
                frozen: Number(settings.frozen_balance || 0),
                withdrawn: totalWithdrawn
            });

            setWithdrawals(withdrawData || []);
            setPixKey(settings.pix_key || 'Não cadastrada');
            setNewPixKey(settings.pix_key || '');

        } catch (error: any) {
            console.error('Erro ao buscar dados financeiros:', error);
            toast.error('Erro ao carregar dados financeiros.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);

        if (isNaN(amount) || amount < 100) {
            toast.error('O valor mínimo para saque é R$ 100,00');
            return;
        }

        if (amount > balance.available) {
            toast.error('Saldo insuficiente para o saque solicitado.');
            return;
        }

        if (!pixKey || pixKey === 'Não cadastrada') {
            toast.error('Por favor, cadastre uma chave PIX antes de solicitar o saque.');
            return;
        }

        try {
            setSubmitting(true);

            const { error: insertError } = await supabase
                .from('withdrawals')
                .insert([{
                    user_id: user?.id,
                    amount_requested: amount,
                    net_amount: amount,
                    pix_key: pixKey,
                    status: 'pending'
                }]);

            if (insertError) throw insertError;

            toast.success('Solicitação de saque enviada com sucesso!');
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            fetchFinancialData();

        } catch (error: any) {
            console.error('Erro ao solicitar saque:', error);
            toast.error('Erro ao processar solicitação de saque.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePix = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPixKey.trim()) {
            toast.error('Informe uma chave PIX válida.');
            return;
        }

        try {
            setSubmitting(true);

            const { error } = await supabase
                .from('user_settings')
                .update({ pix_key: newPixKey.trim() })
                .eq('user_id', user?.id);

            if (error) throw error;

            toast.success('Chave PIX atualizada com sucesso!');
            setPixKey(newPixKey.trim());
            setShowPixModal(false);
        } catch (error: any) {
            console.error('Erro ao atualizar PIX:', error);
            toast.error('Erro ao atualizar chave PIX.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const stats = [
        { label: 'Saldo Total', value: formatCurrency(balance.total), icon: DollarSign, color: 'text-[#0B1221]', bg: 'bg-slate-100' },
        { label: 'Disponível para Saque', value: formatCurrency(balance.available), icon: Wallet, color: 'text-[#FBC02D]', bg: 'bg-amber-50' },
        { label: 'Aguardando Liberação', value: formatCurrency(balance.frozen), icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Sacado', value: formatCurrency(balance.withdrawn), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <AffiliateLayout>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Financeiro</h1>
                    <p className="text-slate-500 font-medium">Gerencie seus ganhos e solicite pagamentos.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={fetchFinancialData}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#FBC02D] transition-all"
                    >
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex-grow md:flex-none bg-[#0B1221] hover:bg-[#1a2436] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-lg shadow-[#0B1221]/20"
                    >
                        <PlusCircle className="w-5 h-5 text-[#FBC02D]" />
                        SOLICITAR SAQUE
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">
                            {loading ? <span className="animate-pulse">...</span> : stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Tables and Main Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-[#0B1221]">Histórico de Saques</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-left py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                    <th className="text-right py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            Carregando histórico...
                                        </td>
                                    </tr>
                                ) : withdrawals.length > 0 ? (
                                    withdrawals.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                                                        <ArrowDownLeft className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-[#0B1221]">Saque solicitado via PIX</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#0B1221]">{formatDate(item.created_at).day}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase">{formatDate(item.created_at).time}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className="font-black text-red-500">
                                                    - {formatCurrency(item.amount_requested)}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'completed' || item.status === 'paid' || item.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' :
                                                    item.status === 'pending' || item.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {item.status === 'pending' ? 'Pendente' :
                                                        item.status === 'completed' || item.status === 'paid' || item.status === 'Pago' ? 'Pago' : 'Cancelado'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold">
                                            Nenhum saque solicitado até o momento.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-8">
                    {/* PIX Key Box */}
                    <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-[#FBC02D]" />
                            </div>
                            <h3 className="font-black">Dados de Recebimento</h3>
                        </div>

                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Chave PIX Cadastrada</p>
                        <p className="font-bold text-lg mb-6 overflow-hidden text-ellipsis">{pixKey}</p>

                        <button
                            onClick={() => setShowPixModal(true)}
                            className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all border border-white/10 text-sm"
                        >
                            ALTERAR CHAVE PIX
                        </button>
                    </div>

                    {/* Rules/Info Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-black text-[#0B1221] text-sm mb-1">Regras de Saque</h4>
                                <ul className="text-xs text-slate-500 font-medium space-y-2">
                                    <li>• Valor mínimo para saque: <strong>R$ 100,00</strong></li>
                                    <li>• Prazo de pagamento: <strong>Até 3 dias úteis</strong></li>
                                    <li>• Chave PIX deve ser do titular da conta</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-[#0B1221]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-black text-[#0B1221] mb-2">Solicitar Saque</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">O valor será enviado para sua chave PIX cadastrada.</p>

                        <form onSubmit={handleWithdrawRequest} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Valor do Saque</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                                    <input
                                        type="number"
                                        placeholder="0,00"
                                        required
                                        min="100"
                                        step="0.01"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-[#FBC02D] transition-all font-bold text-lg"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider">
                                    Disponível: {formatCurrency(balance.available)}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl font-black text-slate-500 transition-all disabled:opacity-50"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#FBC02D] hover:bg-[#ffc947] py-4 rounded-2xl font-black text-[#0B1221] transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Clock className="w-4 h-4 animate-spin" />}
                                    {submitting ? 'PROCESSANDO...' : 'CONFIRMAR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PIX Modal */}
            {showPixModal && (
                <div className="fixed inset-0 bg-[#0B1221]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-black text-[#0B1221] mb-2">Atualizar Chave PIX</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">Informe sua chave PIX para recebimento das comissões.</p>

                        <form onSubmit={handleUpdatePix} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nova Chave PIX</label>
                                <input
                                    type="text"
                                    placeholder="CPF, E-mail, Celular ou Chave Aleatória"
                                    required
                                    value={newPixKey}
                                    onChange={(e) => setNewPixKey(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-[#FBC02D] transition-all font-bold"
                                />
                                <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider">Certifique-se de que a chave está correta.</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowPixModal(false)}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl font-black text-slate-500 transition-all disabled:opacity-50"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#FBC02D] hover:bg-[#ffc947] py-4 rounded-2xl font-black text-[#0B1221] transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Clock className="w-4 h-4 animate-spin" />}
                                    {submitting ? 'SALVANDO...' : 'SALVAR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AffiliateLayout>
    );
};

export default AffiliateFinancial;
