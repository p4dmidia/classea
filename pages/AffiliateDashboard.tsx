
import React, { useState } from 'react';
import {
    Users,
    Wallet,
    TrendingUp,
    Copy,
    CheckCircle,
    ChevronRight,
    ArrowUpRight,
    Clock,
    ExternalLink,
    Award
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

const AffiliateDashboard: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const affiliateLink = "https://classea.com.br/ref/afiliado123";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(affiliateLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = [
        { label: 'Saldo Disponível', value: 'R$ 1.250,00', icon: Wallet, color: 'text-[#FBC02D]' },
        { label: 'Total Ganhos', value: 'R$ 8.420,50', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Indicações Ativas', value: '42', icon: Users, color: 'text-blue-500' },
        { label: 'Taxa de Conversão', value: '12.4%', icon: Award, color: 'text-purple-500' },
    ];

    const recentCommissions = [
        { id: 1, name: 'João Silva', date: 'Hoje, 14:20', value: 'R$ 45,00', status: 'Pendente' },
        { id: 2, name: 'Maria Santos', date: 'Ontem, 18:05', value: 'R$ 120,00', status: 'Confirmado' },
        { id: 3, name: 'Pedro Oliveira', date: '20 Fev, 10:30', value: 'R$ 85,00', status: 'Confirmado' },
        { id: 4, name: 'Ana Costa', date: '19 Fev, 15:45', value: 'R$ 45,00', status: 'Cancelado' },
    ];

    return (
        <AffiliateLayout>
            {/* Top Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Olá, Afiliado!</h1>
                    <p className="text-slate-500 font-medium">Bora ver como estão seus resultados hoje?</p>
                </div>
                <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-[#0B1221] shadow-sm hover:shadow-md transition-all">
                    <ExternalLink className="w-4 h-4 text-[#FBC02D]" />
                    Ver Loja Classe A
                </button>
            </header>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                +8%
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main area - Charts/Links */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Referral Link Card */}
                    <div className="bg-[#0B1221] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-[#0B1221]/20">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2">Seu Link de Afiliado</h2>
                            <p className="text-slate-400 mb-8 max-w-md">Compartilhe seu link exclusivo e ganhe comissões em cada venda realizada através dele.</p>

                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 flex-grow flex items-center justify-between group">
                                    <span className="text-slate-200 font-medium truncate mr-4">{affiliateLink}</span>
                                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all whitespace-nowrap ${copied ? 'bg-emerald-500 text-white' : 'bg-[#FBC02D] text-[#0B1221] hover:bg-[#ffc947]'
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            COPIADO!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            COPIAR LINK
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* Abstract Design Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBC02D]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    </div>

                    {/* Commissions Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#0B1221]">Últimas Indicações</h3>
                            <button className="text-[#FBC02D] font-bold text-sm hover:underline flex items-center gap-1">
                                Ver tudo <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Comissão</th>
                                        <th className="text-right py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentCommissions.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0B1221] font-bold text-xs">
                                                        {item.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-bold text-[#0B1221]">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-2 text-sm text-slate-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {item.date}
                                                </div>
                                            </td>
                                            <td className="py-5 px-2 font-black text-[#0B1221]">{item.value}</td>
                                            <td className="py-5 px-2 text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-600' :
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
                    </div>
                </div>

                {/* Sidebar Area - Profile/Help */}
                <div className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg mx-auto overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <h3 className="text-xl font-black text-[#0B1221]">Félix Schneider</h3>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Afiliado Diamante</p>

                        <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-50 pt-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranking</p>
                                <p className="font-black text-[#0B1221]">#12</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível</p>
                                <p className="font-black text-[#0B1221]">Lv. 5</p>
                            </div>
                        </div>

                        <button className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                            Editar Perfil
                        </button>
                    </div>

                    {/* Support/Resource Box */}
                    <div className="bg-gradient-to-br from-[#FBC02D] to-[#ffa000] rounded-[2.5rem] p-8 text-[#0B1221]">
                        <h3 className="text-xl font-black mb-2">Precisa de ajuda?</h3>
                        <p className="text-[#0B1221]/70 text-sm font-medium mb-6">Nossa equipe está pronta para te ajudar a vender mais.</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 py-4 rounded-2xl font-black transition-all border border-white/20 backdrop-blur-sm">
                            CHAMAR SUPORTE
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateDashboard;
