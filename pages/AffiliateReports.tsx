
import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    MousePointer2,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Activity,
    Layers,
    ChevronRight,
    Filter
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

const AffiliateReports: React.FC = () => {
    const [selectedGen, setSelectedGen] = useState<string>('all');

    const mainStats = [
        { label: 'Cliques Totais', value: '12.450', change: '+12.5%', isPositive: true, icon: MousePointer2, color: 'text-blue-500' },
        { label: 'Conversões', value: '158', change: '+8.2%', isPositive: true, icon: Activity, color: 'text-emerald-500' },
        { label: 'Taxa de Conversão', value: '1.27%', change: '-0.4%', isPositive: false, icon: PieChart, color: 'text-purple-500' },
        { label: 'Receita Gerada', value: 'R$ 48.250', change: '+15.3%', isPositive: true, icon: TrendingUp, color: 'text-[#FBC02D]' },
    ];

    const generationGains = [
        { gen: '1ª', amount: 15400, percentage: 85 },
        { gen: '2ª', amount: 8200, percentage: 65 },
        { gen: '3ª', amount: 4100, percentage: 45 },
        { gen: '4ª', amount: 2100, percentage: 30 },
        { gen: '5ª', amount: 950, percentage: 15 },
        { gen: '6ª', amount: 450, percentage: 8 },
        { gen: '7ª', amount: 120, percentage: 3 },
    ];

    const detailedCommissions = [
        { id: 1, date: '21/02/2026', from: 'João Silva', product: 'Colchão Gold', gen: '1ª', amount: 450.00 },
        { id: 2, date: '21/02/2026', from: 'Maria Oliveira', product: 'Consórcio Cota 01', gen: '2ª', amount: 125.00 },
        { id: 3, date: '20/02/2026', from: 'Pedro Santos', product: 'Travesseiro Ergo', gen: '1ª', amount: 45.00 },
        { id: 4, date: '20/02/2026', from: 'Ana Costa', product: 'Kit Bio-Mag', gen: '3ª', amount: 65.00 },
        { id: 5, date: '19/02/2026', from: 'Roberto Lima', product: 'Colchão Silver', gen: '5ª', amount: 25.50 },
    ];

    return (
        <AffiliateLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#0B1221]">Análise de Ganhos</h1>
                        <p className="text-slate-500 font-medium">Veja detalhadamente de onde vêm suas comissões.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 shadow-sm hover:shadow-md transition-all">
                            <Calendar className="w-4 h-4 text-[#FBC02D]" />
                            Fevereiro 2026
                        </button>
                        <button className="bg-[#0B1221] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#1a2436] transition-all">
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainStats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-[#0B1221]">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Generation Breakdown */}
                    <div className="lg:col-span-5 bg-[#0B1221] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#0B1221]/20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 rounded-2xl text-[#FBC02D]">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Ganhos por Geração</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sua rede nas 7 profundidades</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {generationGains.map((item, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">{item.gen} Geração</span>
                                        <span className="text-sm font-black">R$ {item.amount.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FBC02D]/40 to-[#FBC02D] rounded-full transition-all duration-1000 origin-left"
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Dica de Performance</p>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed">Suas gerações 4ª em diante representam **12%** do seu ganho. Fomentar líderes nessas profundidades pode dobrar sua receita passiva.</p>
                        </div>
                    </div>

                    {/* Detailed Transaction Table */}
                    <div className="lg:col-span-7 bg-white rounded-[3rem] p-4 md:p-8 border border-slate-100 shadow-sm flex flex-col">
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                            <h3 className="text-xl font-black text-[#0B1221]">Extrato Detalhado</h3>
                            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {['all', '1ª', '2ª+'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setSelectedGen(f)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedGen === f ? 'bg-white shadow-sm text-[#0B1221]' : 'text-slate-400'}`}
                                    >
                                        {f === 'all' ? 'Tudo' : f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-grow">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Origem</th>
                                        <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gen</th>
                                        <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                        <th className="text-right py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-xs">
                                    {detailedCommissions.map((c) => (
                                        <tr key={c.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                                            <td className="py-5 px-4">
                                                <p className="font-bold text-[#0B1221] mb-0.5">{c.from}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{c.product}</p>
                                            </td>
                                            <td className="py-5 px-4 font-black text-slate-400">{c.gen}</td>
                                            <td className="py-5 px-4">
                                                <p className="font-black text-[#0B1221]">R$ {c.amount.toFixed(2).replace('.', ',')}</p>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <p className="text-slate-400 font-bold">{c.date}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="w-full mt-6 py-4 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-[#FBC02D] hover:text-[#0B1221] transition-all">
                            Carregar mais transações
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateReports;
