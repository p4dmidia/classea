
import React, { useState } from 'react';
import {
    ShoppingCart,
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    Package,
    User,
    Calendar,
    Download,
    ArrowUpRight,
    Truck,
    MapPin
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminOrders: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const orders = [
        {
            id: '#ORD-9842',
            customer: 'Cláudio Ferreira',
            date: '21 Fev, 14:20',
            product: 'Colchão Classe A Gold',
            total: 'R$ 4.590',
            status: 'Pago',
            payment: 'Cartão de Crédito',
            referral: 'afiliado123'
        },
        {
            id: '#ORD-9841',
            customer: 'Renata Souza',
            date: '21 Fev, 11:05',
            product: 'Acessório Magnético',
            total: 'R$ 290',
            status: 'Pendente',
            payment: 'Pix',
            referral: 'afiliado55'
        },
        {
            id: '#ORD-9840',
            customer: 'Marcos Almeida',
            date: '20 Fev, 18:45',
            product: 'Consórcio Classe A',
            total: 'R$ 890',
            status: 'Enviado',
            payment: 'Boleto',
            referral: 'afiliado123'
        },
        {
            id: '#ORD-9839',
            customer: 'Juliana Lima',
            date: '20 Fev, 15:30',
            product: 'Colchão Smart Sleep',
            total: 'R$ 3.850',
            status: 'Cancelado',
            payment: 'Cartão de Crédito',
            referral: 'afiliado89'
        },
        {
            id: '#ORD-9838',
            customer: 'Roberto Santos',
            date: '20 Fev, 10:15',
            product: 'Pillow Top Visco',
            total: 'R$ 890',
            status: 'Pago',
            payment: 'Pix',
            referral: 'Nenhum'
        },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pago': return 'bg-emerald-50 text-emerald-600';
            case 'Pendente': return 'bg-amber-50 text-amber-600';
            case 'Enviado': return 'bg-blue-50 text-blue-600';
            case 'Cancelado': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Pedidos</h1>
                        <p className="text-slate-500 font-medium">Acompanhe e gerencie todas as vendas realizadas na plataforma.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all">
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </button>
                        <button className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all">
                            <PlusIcon className="w-4 h-4" />
                            Novo Pedido
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente ou produto..."
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
                        <div className="h-10 w-px bg-slate-100 hidden md:block self-center"></div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                            <span className="text-xs font-black text-[#05080F]">Todos</span>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">ID Pedido</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Cliente</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Produto</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Total</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <span className="font-black text-[#05080F]">{order.id}</span>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{order.date}</p>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                    {order.customer.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#05080F]">{order.customer}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                        <MapPin className="w-3 h-3" /> São Paulo, SP
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-[#FBC02D]" />
                                                <span className="text-sm font-bold text-slate-600">{order.product}</span>
                                            </div>
                                            {order.referral !== 'Nenhum' && (
                                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mt-0.5">Ref: {order.referral}</p>
                                            )}
                                        </td>
                                        <td className="py-6 px-4">
                                            <p className="font-black text-[#05080F]">{order.total}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{order.payment}</p>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {order.status === 'Pago' && <CheckCircle className="w-3 h-3" />}
                                                {order.status === 'Pendente' && <Clock className="w-3 h-3" />}
                                                {order.status === 'Enviado' && <Truck className="w-3 h-3" />}
                                                {order.status === 'Cancelado' && <XCircle className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all" title="Ver Detalhes">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400 font-medium">Mostrando 5 de 1.258 pedidos</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">Anterior</button>
                            <button className="px-4 py-2 bg-[#05080F] rounded-xl text-sm font-bold text-white shadow-lg shadow-[#05080F]/10">1</button>
                            <button className="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm font-bold text-[#05080F] transition-all">2</button>
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#05080F] hover:bg-slate-50 transition-all">Próximo</button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Integration / Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-emerald-500 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pedidos de Hoje</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black">24</h4>
                            <ArrowUpRight className="w-6 h-6 opacity-40" />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pagamentos Pendentes</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">08</h4>
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Em Envio</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">15</h4>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mês</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">482</h4>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Quick Icons
const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default AdminOrders;
