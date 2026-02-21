
import React from 'react';
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
    Activity
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

const AffiliateReports: React.FC = () => {
    const mainStats = [
        { label: 'Cliques Totais', value: '12.450', change: '+12.5%', isPositive: true, icon: MousePointer2, color: 'text-blue-500' },
        { label: 'Conversões', value: '158', change: '+8.2%', isPositive: true, icon: Activity, color: 'text-emerald-500' },
        { label: 'Taxa de Conversão', value: '1.27%', change: '-0.4%', isPositive: false, icon: PieChart, color: 'text-purple-500' },
        { label: 'Receita Gerada', value: 'R$ 48.250', change: '+15.3%', isPositive: true, icon: TrendingUp, color: 'text-[#FBC02D]' },
    ];

    const performanceByCategory = [
        { category: 'Colchões Premium', sales: 45, percentage: 65, color: 'bg-blue-500' },
        { category: 'Acessórios Magnéticos', sales: 28, percentage: 40, color: 'bg-emerald-500' },
        { category: 'Consórcios', sales: 12, percentage: 25, color: 'bg-amber-500' },
        { category: 'Vestuário', sales: 15, percentage: 30, color: 'bg-purple-500' },
    ];

    const deviceStats = [
        { label: 'Mobile', value: '65%', icon: '📱' },
        { label: 'Desktop', value: '30%', icon: '💻' },
        { label: 'Tablet', value: '5%', icon: '📟' },
    ];

    return (
        <AffiliateLayout>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Relatórios de Desempenho</h1>
                    <p className="text-slate-500 font-medium">Análise detalhada do seu tráfego e conversões.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 shadow-sm hover:shadow-md transition-all">
                        <Calendar className="w-4 h-4 text-[#FBC02D]" />
                        Últimos 30 dias
                    </button>
                    <button className="bg-[#0B1221] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#1a2436] transition-all">
                        <Download className="w-4 h-4" />
                        Relatório PDF
                    </button>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
                                }`}>
                                {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-[#0B1221]">Evolução de Vendas</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Cliques
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-[#FBC02D]"></div> Vendas
                            </span>
                        </div>
                    </div>

                    {/* Simulated Chart with Flex/Bars */}
                    <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
                        {[40, 60, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-full relative flex items-end justify-center gap-0.5">
                                    <div
                                        className="w-full bg-blue-500/10 group-hover:bg-blue-500/30 rounded-t-lg transition-all"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <div
                                        className="w-1/3 bg-[#FBC02D] group-hover:scale-y-110 origin-bottom rounded-t-lg transition-all absolute bottom-0"
                                        style={{ height: `${height * 0.4}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{i + 1} Mar</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column Stats */}
                <div className="space-y-8">
                    {/* Category Performance */}
                    <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white">
                        <h3 className="text-lg font-black mb-6">Vendas por Categoria</h3>
                        <div className="space-y-6">
                            {performanceByCategory.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-slate-300">{item.category}</span>
                                        <span className="font-black">{item.sales}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Devices/Origin */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <h3 className="text-lg font-black text-[#0B1221] mb-6">Origem do Tráfego</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {deviceStats.map((device, idx) => (
                                <div key={idx} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-2xl mb-2 block">{device.icon}</span>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{device.label}</p>
                                    <p className="text-lg font-black text-[#0B1221] mt-1">{device.value}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-4 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-[#FBC02D] hover:text-[#FBC02D] transition-all">
                            Ver Detalhes do Tráfego
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateReports;
