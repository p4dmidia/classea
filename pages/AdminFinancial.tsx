import React, { useState, useEffect } from 'react';
import {
    Wallet,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Calendar,
    Send,
    ShieldCheck,
    Coins,
    Banknote,
    Loader2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WithdrawalRequest {
    id: string;
    user_id: string;
    amount_requested: number;
    fee_amount: number;
    net_amount: number;
    pix_key: string;
    created_at: string;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    affiliate?: {
        full_name: string;
    };
}

const AdminFinancial: React.FC = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingLot, setProcessingLot] = useState(false);
    const [orgIdState, setOrgIdState] = useState<string>('5111af72-27a5-41fd-8ed9-8c51b78b4fdd');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            // 0. Fetch Classe A Organization ID
            const { data: orgData } = await supabase
                .from('organizations')
                .select('id')
                .eq('name', 'Classe A')
                .single();
            
            const effectiveOrgId = orgData?.id || '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';
            setOrgIdState(effectiveOrgId);

            const { data, error } = await supabase
                .from('withdrawals')
                .select(`
                    *,
                    affiliate:affiliates(full_name)
                `)
                .eq('organization_id', effectiveOrgId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Erro ao carregar pedidos de saque.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const name = req.affiliate?.full_name || 'Usuário Desconhecido';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || req.pix_key.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('withdrawals')
                .update({ status: newStatus })
                .eq('id', id)
                .eq('organization_id', orgIdState);

            if (error) throw error;

            toast.success(newStatus === 'approved' ? 'Saque aprovado!' : 'Saque rejeitado.');
            fetchRequests();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Erro ao atualizar status.');
        }
    };

    const handleProcessBatch = async () => {
        const approvedCount = requests.filter(r => r.status === 'approved').length;

        if (approvedCount === 0) {
            toast.error('Não há saques aprovados para processar.');
            return;
        }

        if (!confirm(`Deseja marcar ${approvedCount} saques aprovados como pagos?`)) return;

        setProcessingLot(true);
        try {
            const { error } = await supabase
                .from('withdrawals')
                .update({
                    status: 'paid',
                    processed_at: new Date().toISOString()
                })
                .eq('status', 'approved')
                .eq('organization_id', orgIdState);

            if (error) throw error;

            toast.success(`${approvedCount} saques marcados como pagos com sucesso!`);
            fetchRequests();
        } catch (error) {
            console.error('Error processing batch:', error);
            toast.error('Erro ao processar lote.');
        } finally {
            setProcessingLot(false);
        }
    };

    // Stats calculations
    const totalPendente = requests
        .filter(r => r.status === 'pending' || r.status === 'approved')
        .reduce((acc, curr) => acc + curr.amount_requested, 0);

    const paidThisMonth = requests
        .filter(r => {
            if (r.status !== 'paid') return false;
            const date = new Date(r.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((acc, curr) => acc + curr.amount_requested, 0);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                    <p className="font-bold text-slate-400">Carregando dados financeiros...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#05080F]">Gestão Financeira</h1>
                        <p className="text-slate-500 font-medium text-sm md:text-base">Controle de saques, aprovações e processamento de pagamentos.</p>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-[#05080F] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBC02D]/10 blur-3xl rounded-full"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-md">
                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-[#FBC02D]" />
                            </div>
                            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest leading-none mb-2">Total Pendente</p>
                            <h3 className="text-2xl md:text-3xl font-black text-[#FBC02D]">
                                R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest leading-none mb-2">Pago este Mês</p>
                        <h3 className="text-2xl md:text-3xl font-black text-[#05080F]">
                            R$ {paidThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-center sm:col-span-2 lg:col-span-1">
                        <h4 className="font-black text-[#05080F] mb-1">Pagamento em Lote</h4>
                        <p className="text-[10px] md:text-xs font-medium text-slate-500 mb-4 md:mb-6 leading-relaxed">Conforme o PRD, os pagamentos são consolidados no dia 15 de cada mês.</p>
                        <button
                            disabled={processingLot}
                            onClick={handleProcessBatch}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${processingLot ? 'bg-slate-100 text-slate-400' : 'bg-[#FBC02D] text-[#0B1221] hover:bg-[#ffc947] shadow-xl shadow-amber-200/50'}`}
                        >
                            {processingLot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
                            {processingLot ? 'PROCESSANDO...' : 'PROCESSAR LOTE (DIA 15)'}
                        </button>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-10 border-b border-slate-50">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                            <h3 className="text-lg md:text-xl font-black text-[#05080F]">Pedidos de Saque</h3>

                            <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
                                <div className="relative flex-1 sm:min-w-[280px]">
                                    <input
                                        type="text"
                                        placeholder="Buscar por afiliado ou chave PIX..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-10 outline-none text-[10px] md:text-xs font-medium focus:border-[#FBC02D] transition-all"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                </div>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
                                    {(['all', 'pending', 'approved', 'paid', 'rejected'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {f === 'all' ? 'Ver Todos' : f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovados' : f === 'paid' ? 'Pagos' : 'Recusados'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block lg:hidden divide-y divide-slate-50">
                        {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                            <div key={req.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Afiliado</p>
                                        <p className="font-black text-[#05080F] text-sm">{req.affiliate?.full_name || 'Usuário Desconhecido'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                            <Send className="w-3 h-3 text-[#FBC02D]" /> {req.pix_key}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${req.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                        req.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                                            req.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {req.status === 'pending' ? 'Aguardando' :
                                            req.status === 'approved' ? 'Aprovado' :
                                                req.status === 'paid' ? 'Pago' : 'Recusado'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Data</p>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                            {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Valor</p>
                                        <p className="font-black text-[#05080F]">R$ {req.amount_requested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                {req.status === 'pending' && (
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                                        >
                                            REJEITAR
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'approved')}
                                            className="flex-3 py-3 bg-[#05080F] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FBC02D] hover:text-[#05080F] transition-all border border-[#05080F]"
                                        >
                                            APROVAR SAQUE
                                        </button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4 text-slate-400">
                                    <Wallet className="w-12 h-12 opacity-20" />
                                    <p className="font-bold">Nenhum pedido encontrado.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="text-left py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Afiliado / Chave PIX</th>
                                    <th className="text-left py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Data Solicitada</th>
                                    <th className="text-left py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Valor</th>
                                    <th className="text-left py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                                    <th className="text-right py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                                    <tr key={req.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="py-6 px-10">
                                            <div>
                                                <p className="font-black text-[#05080F] text-sm">{req.affiliate?.full_name || 'Usuário Desconhecido'}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                                    <Send className="w-3 h-3 text-[#FBC02D]" /> {req.pix_key}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <p className="font-black text-[#05080F]">R$ {req.amount_requested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${req.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                                req.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                                                    req.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'paid' ? 'bg-emerald-500' :
                                                    req.status === 'approved' ? 'bg-blue-300' :
                                                        req.status === 'rejected' ? 'bg-red-400' : 'bg-amber-400'
                                                    }`}></div>
                                                {req.status === 'pending' ? 'Aguardando' :
                                                    req.status === 'approved' ? 'Aprovado' :
                                                        req.status === 'paid' ? 'Pago' : 'Recusado'}
                                            </span>
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(req.id, 'rejected')}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                                        title="Recusar"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, 'approved')}
                                                        className="p-2.5 bg-[#05080F] text-white rounded-xl hover:bg-[#FBC02D] hover:text-[#05080F] transition-all"
                                                        title="Aprovar Saque"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                            {(req.status === 'approved' || req.status === 'paid' || req.status === 'rejected') && (
                                                <button className="p-2.5 text-slate-300 cursor-not-allowed">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-400">
                                                <Wallet className="w-12 h-12 opacity-20" />
                                                <p className="font-bold">Nenhum pedido de saque encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-[#FBC02D]/10 border border-[#FBC02D]/20 p-6 md:p-8 rounded-[2rem] flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FBC02D] shadow-sm flex-shrink-0">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-[#05080F] text-xs md:text-sm uppercase tracking-widest leading-none mb-2 text-center sm:text-left">Pagamentos Consolidados</h4>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 leading-relaxed text-center sm:text-left">
                            O processamento em lote move todos os pedidos <span className="text-[#05080F]">Aprovados</span> para o status <span className="text-[#05080F]">Pago</span>. 
                            Recomenda-se realizar esta ação no dia 15 de cada mês conforme as diretrizes do sistema.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminFinancial;
