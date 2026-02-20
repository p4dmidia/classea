
import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowDown
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

const AffiliateReferrals: React.FC = () => {
    const stats = [
        { label: 'Total de Indicações', value: '158', icon: Users, color: 'text-blue-500' },
        { label: 'Confirmadas', value: '124', icon: CheckCircle, color: 'text-emerald-500' },
        { label: 'Pendentes', value: '28', icon: Clock, color: 'text-amber-500' },
        { label: 'Canceladas', value: '6', icon: XCircle, color: 'text-red-500' },
    ];

    const referrals = [
        { id: 1, name: 'Cláudio Ferreira', product: 'Colchão Classe A Gold', date: '21 Fev, 09:15', commission: 'R$ 150,00', status: 'Confirmado', payment: '25 Fev' },
        { id: 2, name: 'Renata Souza', product: 'Acessório Magnético', date: '20 Fev, 14:20', commission: 'R$ 45,00', status: 'Pendente', payment: '-' },
        { id: 3, name: 'Marcos Almeida', product: 'Consórcio Classe A', date: '19 Fev, 11:30', commission: 'R$ 450,00', status: 'Aguardando Pagamento', payment: '-' },
        { id: 4, name: 'Juliana Lima', product: 'Colchão Smart Sleep', date: '18 Fev, 16:45', commission: 'R$ 120,00', status: 'Confirmado', payment: '22 Fev' },
        { id: 5, name: 'Roberto Santos', product: 'Vestuário Premium', date: '17 Fev, 10:05', commission: 'R$ 35,00', status: 'Cancelado', payment: '-' },
        { id: 6, name: 'Beatriz Costa', product: 'Colchão Classe A Kids', date: '16 Fev, 19:20', commission: 'R$ 85,00', status: 'Confirmado', payment: '20 Fev' },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AffiliateLayout>
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-black text-[#0B1221]">Minhas Indicações</h1>
                <p className="text-slate-500 font-medium">Acompanhe em tempo real todos os clientes que você trouxe.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Table/Filters Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters Bar */}
                <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome do cliente..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#FBC02D] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                        <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0B1221] rounded-2xl font-bold text-white hover:bg-[#1a2436] transition-all text-sm">
                            Exportar CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="text-left py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    Cliente <ArrowDown className="w-3 h-3" />
                                </th>
                                <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Produto</th>
                                <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                                <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Comissão</th>
                                <th className="text-center py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-right py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Pagamento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {referrals.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0B1221] text-[#FBC02D] flex items-center justify-center font-black text-xs">
                                                {item.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-bold text-[#0B1221]">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="text-sm font-medium text-slate-600">{item.product}</span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#0B1221]">{item.date.split(',')[0]}</span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase">{item.date.split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-1 text-[#0B1221] font-black">
                                            {item.commission}
                                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-600' :
                                                item.status === 'Pendente' ? 'bg-amber-50 text-amber-600' :
                                                    item.status === 'Aguardando Pagamento' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {item.status === 'Confirmado' && <CheckCircle className="w-3 h-3" />}
                                            {item.status === 'Pendente' && <Clock className="w-3 h-3" />}
                                            {item.status === 'Aguardando Pagamento' && <AlertCircle className="w-3 h-3" />}
                                            {item.status === 'Cancelado' && <XCircle className="w-3 h-3" />}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <span className={`text-sm font-bold ${item.payment === '-' ? 'text-slate-300' : 'text-[#0B1221]'}`}>
                                            {item.payment}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-sm text-slate-400 font-medium">Mostrando 6 de 158 indicações</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">Anterior</button>
                        <button className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-[#0B1221]">1</button>
                        <button className="px-4 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-[#0B1221]">2</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#0B1221]">Próximo</button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateReferrals;
