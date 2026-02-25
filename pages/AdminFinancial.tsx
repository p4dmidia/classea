
import React, { useState } from 'react';
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
    Banknote
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface WithdrawalRequest {
    id: string;
    affiliateName: string;
    amount: number;
    pixKey: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
}

const AdminFinancial: React.FC = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([
        { id: '1', affiliateName: 'Felix Schneider', amount: 1250.00, pixKey: 'felix@email.com', requestDate: '21/02/2026', status: 'pending' },
        { id: '2', affiliateName: 'Maria Santos', amount: 450.00, pixKey: '123.456.789-00', requestDate: '20/02/2026', status: 'pending' },
        { id: '3', affiliateName: 'João Silva', amount: 890.00, pixKey: '11998877665', requestDate: '19/02/2026', status: 'approved' },
        { id: '4', affiliateName: 'Ana Costa', amount: 2100.00, pixKey: 'ana.costa@banco.com', requestDate: '15/02/2026', status: 'paid' },
    ]);

    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingLot, setProcessingLot] = useState(false);

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const matchesSearch = req.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) || req.pixKey.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    const handleProcessBatch = () => {
        setProcessingLot(true);
        // Simulate processing day 15 batch
        setTimeout(() => {
            setRequests(prev => prev.map(req => req.status === 'approved' ? { ...req, status: 'paid' } : req));
            setProcessingLot(false);
            alert('Lote de pagamentos processado com sucesso! Todos os aprovados foram marcados como pagos.');
        }, 2000);
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão Financeira</h1>
                        <p className="text-slate-500 font-medium">Controle de saques, aprovações e processamento de pagamentos.</p>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#05080F] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBC02D]/10 blur-3xl rounded-full"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Wallet className="w-6 h-6 text-[#FBC02D]" />
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-none mb-2">Total Pendente</p>
                            <h3 className="text-3xl font-black text-[#FBC02D]">
                                R$ {requests.filter(r => r.status === 'pending' || r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-none mb-2">Pago este Mês</p>
                        <h3 className="text-3xl font-black text-[#05080F]">
                            R$ {requests.filter(r => r.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
                        <h4 className="font-black text-[#05080F] mb-1">Pagamento em Lote</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">Conforme o PRD, os pagamentos são consolidados no dia 15 de cada mês.</p>
                        <button
                            disabled={processingLot}
                            onClick={handleProcessBatch}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${processingLot ? 'bg-slate-100 text-slate-400' : 'bg-[#FBC02D] text-[#0B1221] hover:bg-[#ffc947] shadow-xl shadow-amber-200/50'}`}
                        >
                            {processingLot ? <Clock className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
                            {processingLot ? 'PROCESSANDO...' : 'PROCESSAR LOTE (DIA 15)'}
                        </button>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <h3 className="text-xl font-black text-[#05080F]">Pedidos de Saque</h3>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative min-w-[240px]">
                                    <input
                                        type="text"
                                        placeholder="Buscar por afiliado ou chave PIX..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-10 outline-none text-xs font-medium focus:border-[#FBC02D] transition-all"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                </div>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                    {(['all', 'pending', 'approved', 'paid'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {f === 'all' ? 'Ver Todos' : f === 'pending' ? 'Pendentes' : f === 'approved' ? 'Aprovados' : 'Pagos'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
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
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="py-6 px-10">
                                            <div>
                                                <p className="font-black text-[#05080F] text-sm">{req.affiliateName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                                    <Send className="w-3 h-3 text-[#FBC02D]" /> {req.pixKey}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                {req.requestDate}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <p className="font-black text-[#05080F]">R$ {req.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-[#FBC02D]/10 border border-[#FBC02D]/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FBC02D] shadow-sm flex-shrink-0">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-[#05080F] text-sm uppercase tracking-widest leading-none mb-1">Próximo Lote</h4>
                        <p className="text-xs font-bold text-slate-500">O processamento automático ocorrerá no dia **15/03/2026**. Certifique-se de aprovar todos os pedidos antes desta data.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminFinancial;
