
import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
    Calendar,
    ArrowUpDown,
    Download
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminAffiliates: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const affiliates = [
        {
            id: 1,
            name: 'Ricardo Santos',
            email: 'ricardo@email.com',
            phone: '(11) 98765-4321',
            plan: 'Diamante',
            status: 'Ativo',
            referrals: 158,
            earnings: 'R$ 12.450',
            joined: '15 Jan 2024'
        },
        {
            id: 2,
            name: 'Letícia Barros',
            email: 'leticia@email.com',
            phone: '(21) 97654-3210',
            plan: 'Ouro',
            status: 'Pendente',
            referrals: 42,
            earnings: 'R$ 4.250',
            joined: '02 Fev 2024'
        },
        {
            id: 3,
            name: 'Marcos Oliveira',
            email: 'marcos@email.com',
            phone: '(31) 96543-2109',
            plan: 'Prata',
            status: 'Ativo',
            referrals: 85,
            earnings: 'R$ 6.800',
            joined: '20 Dez 2023'
        },
        {
            id: 4,
            name: 'Fernanda Lima',
            email: 'fernanda@email.com',
            phone: '(41) 95432-1098',
            plan: 'Bronze',
            status: 'Bloqueado',
            referrals: 12,
            earnings: 'R$ 850',
            joined: '10 Jan 2024'
        },
        {
            id: 5,
            name: 'Paulo Silva',
            email: 'paulo@email.com',
            phone: '(51) 94321-0987',
            plan: 'Diamante',
            status: 'Ativo',
            referrals: 210,
            earnings: 'R$ 18.200',
            joined: '05 Nov 2023'
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-emerald-50 text-emerald-600';
            case 'Pendente': return 'bg-amber-50 text-amber-600';
            case 'Bloqueado': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'Diamante': return 'text-blue-600';
            case 'Ouro': return 'text-amber-500';
            case 'Prata': return 'text-slate-400';
            case 'Bronze': return 'text-orange-600';
            default: return 'text-slate-600';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Afiliados</h1>
                        <p className="text-slate-500 font-medium">Visualize, edite e gerencie todos os parceiros da plataforma.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all">
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                        <button className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all">
                            <UserPlus className="w-4 h-4" />
                            Novo Afiliado
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, e-mail ou telefone..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
                            <Filter className="w-4 h-4 text-[#FBC02D]" />
                            Filtros Avançados
                        </button>
                    </div>
                </div>

                {/* Affiliates Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-[#05080F] transition-colors">
                                            Afiliado <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Plano</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Indicações</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ganhos Totais</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {affiliates.map((aff) => (
                                    <tr key={aff.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#05080F] overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aff.name}`} alt={aff.name} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#05080F]">{aff.name}</p>
                                                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                            <Mail className="w-3 h-3" /> {aff.email}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                            <Phone className="w-3 h-3" /> {aff.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`text-sm font-black uppercase tracking-tight ${getPlanColor(aff.plan)}`}>
                                                {aff.plan}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 font-bold text-[#05080F]">{aff.referrals}</td>
                                        <td className="py-6 px-4 font-black text-emerald-600">{aff.earnings}</td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(aff.status)}`}>
                                                {aff.status === 'Ativo' && <CheckCircle className="w-3 h-3" />}
                                                {aff.status === 'Pendente' && <AlertCircle className="w-3 h-3" />}
                                                {aff.status === 'Bloqueado' && <XCircle className="w-3 h-3" />}
                                                {aff.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400 font-medium">Mostrando 5 de 142 afiliados cadastrados</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">Anterior</button>
                            <button className="px-4 py-2 bg-[#05080F] rounded-xl text-sm font-bold text-white shadow-lg shadow-[#05080F]/10">1</button>
                            <button className="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm font-bold text-[#05080F] transition-all">2</button>
                            <button className="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm font-bold text-[#05080F] transition-all">3</button>
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#05080F] hover:bg-slate-50 transition-all">Próximo</button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#05080F] rounded-[2rem] p-6 text-white flex items-center gap-5 shadow-xl shadow-[#05080F]/10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total de Afiliados</p>
                            <h4 className="text-2xl font-black">1.425</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Solicitações Pendentes</p>
                            <h4 className="text-2xl font-black text-[#05080F]">12</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novos este Mês</p>
                            <h4 className="text-2xl font-black text-[#05080F]">+248</h4>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAffiliates;
