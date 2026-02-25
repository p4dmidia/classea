import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    MoreHorizontal,
    CheckCircle,
    XCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard: React.FC = () => {
    const stats = [
        { label: 'Vendas Totais', value: 'R$ 142.500', change: '+14.5%', isPositive: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Novas Indicações', value: '42', change: '+8.2%', isPositive: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Pedidos Pendentes', value: '12', change: '-2.4%', isPositive: false, icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Taxa de Retenção', value: '94.2%', change: '+1.2%', isPositive: true, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const recentAffiliates = [
        { name: 'Ricardo Santos', date: 'Hoje, 10:30', status: 'Ativo', plan: 'Diamante' },
        { name: 'Letícia Barros', date: 'Hoje, 09:15', status: 'Pendente', plan: 'Bronze' },
        { name: 'Marcos Oliveira', date: 'Ontem, 18:45', status: 'Ativo', plan: 'Ouro' },
        { name: 'Fernanda Lima', date: 'Ontem, 15:20', status: 'Bloqueado', plan: 'Prata' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-black text-[#05080F]">Dashboard Administrativo</h1>
                    <p className="text-slate-500 font-medium">Bem-vindo de volta! Aqui está o resumo operacional de hoje.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
                                    }`}>
                                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-[#05080F] mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Growth Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#05080F]">Crescimento da Plataforma</h3>
                            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-[#05080F] outline-none">
                                <option>Últimos 12 meses</option>
                                <option>Últimos 30 dias</option>
                            </select>
                        </div>
                        <div className="h-[300px] flex items-end justify-between gap-4">
                            {[40, 55, 45, 70, 60, 85, 75, 95, 80, 100, 90, 110].map((h, i) => (
                                <div key={i} className="flex-grow flex flex-col items-center gap-3 group">
                                    <div
                                        className="w-full bg-[#05080F]/5 group-hover:bg-[#FBC02D] rounded-t-xl transition-all duration-500 cursor-pointer relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#05080F] text-white text-[10px] py-1 px-2 rounded-lg font-black whitespace-nowrap">
                                            R$ {h}.000
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Affiliates List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#05080F]">Novos Afiliados</h3>
                            <button className="text-[#FBC02D] hover:text-[#05080F] transition-colors"><MoreHorizontal /></button>
                        </div>
                        <div className="space-y-6">
                            {recentAffiliates.map((aff, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#05080F]">
                                            {aff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-[#05080F] text-sm">{aff.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {aff.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[#FBC02D] uppercase tracking-widest">{aff.plan}</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${aff.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' :
                                            aff.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {aff.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link
                            to="/admin/affiliates"
                            className="w-full mt-8 py-4 bg-[#05080F] text-white rounded-2xl font-black text-sm hover:bg-[#1a2436] transition-all shadow-xl shadow-[#05080F]/10 flex items-center justify-center"
                        >
                            GERENCIAR AFILIADOS
                        </Link>
                    </div>
                </div>

                {/* Quick Actions / Integration Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-500 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl shadow-emerald-500/20">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Mercado Pago</p>
                            <h4 className="text-lg font-black flex items-center gap-2">Online <CheckCircle className="w-4 h-4" /></h4>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-blue-600 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl shadow-blue-600/20">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">E-mail Marketing</p>
                            <h4 className="text-lg font-black flex items-center gap-2">Ativado <CheckCircle className="w-4 h-4" /></h4>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Backup do Sistema</p>
                            <h4 className="text-lg font-black text-[#05080F]">Há 2 horas atrás</h4>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const Activity = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default AdminDashboard;
