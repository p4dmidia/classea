
import React, { useState } from 'react';
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
    AlertCircle
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

const AffiliateFinancial: React.FC = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const stats = [
        { label: 'Saldo Total', value: 'R$ 8.420,50', icon: DollarSign, color: 'text-[#0B1221]', bg: 'bg-slate-100' },
        { label: 'Disponível para Saque', value: 'R$ 1.250,00', icon: Wallet, color: 'text-[#FBC02D]', bg: 'bg-amber-50' },
        { label: 'Aguardando Liberação', value: 'R$ 3.120,00', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Sacado', value: 'R$ 4.050,50', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    const transactions = [
        { id: 1, type: 'commission', description: 'Comissão - João Silva', date: '21 Fev, 14:20', value: 'R$ 150,00', status: 'Confirmado' },
        { id: 2, type: 'withdrawal', description: 'Saque solicitado', date: '20 Fev, 09:15', value: '- R$ 500,00', status: 'Pendente' },
        { id: 3, type: 'commission', description: 'Comissão - Maria Santos', date: '19 Fev, 18:05', value: 'R$ 45,00', status: 'Confirmado' },
        { id: 4, type: 'withdrawal', description: 'Saque pago em conta', date: '15 Fev, 10:30', value: '- R$ 1.200,00', status: 'Pago' },
        { id: 5, type: 'commission', description: 'Comissão - Pedro Oliveira', date: '14 Fev, 11:30', value: 'R$ 85,00', status: 'Confirmado' },
    ];

    const handleWithdrawRequest = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Solicitação de saque de R$ ${withdrawAmount} enviada com sucesso! (Simulação)`);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
    };

    return (
        <AffiliateLayout>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Financeiro</h1>
                    <p className="text-slate-500 font-medium">Gerencie seus ganhos e solicite pagamentos.</p>
                </div>
                <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-[#0B1221] hover:bg-[#1a2436] text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black transition-all shadow-lg shadow-[#0B1221]/20"
                >
                    <PlusCircle className="w-5 h-5 text-[#FBC02D]" />
                    SOLICITAR SAQUE
                </button>
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
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Tables and Main Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-slate-50">
                        <h3 className="text-xl font-black text-[#0B1221]">Extrato de Lançamentos</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-left py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Tipo / Descrição</th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                    <th className="text-right py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transactions.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'commission' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {item.type === 'commission' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                                </div>
                                                <span className="font-bold text-[#0B1221]">{item.description}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-sm font-medium text-slate-500">{item.date}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`font-black ${item.type === 'withdrawal' ? 'text-red-500' : 'text-[#0B1221]'}`}>
                                                {item.value}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Confirmado' || item.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' :
                                                    item.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 border-t border-slate-50 text-center">
                        <button className="text-[#FBC02D] font-bold text-sm hover:underline">Ver extrato completo</button>
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
                        <p className="font-bold text-lg mb-6">felix***@gmail.com</p>

                        <button className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all border border-white/10 text-sm">
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
                                    <li>• Comissões levam <strong>7 dias</strong> para serem liberadas</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal Simulation */}
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
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-[#FBC02D] transition-all font-bold text-lg"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-wider">Disponível: R$ 1.250,50</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl font-black text-slate-500 transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#FBC02D] hover:bg-[#ffc947] py-4 rounded-2xl font-black text-[#0B1221] transition-all shadow-lg shadow-amber-200"
                                >
                                    CONFIRMAR
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
