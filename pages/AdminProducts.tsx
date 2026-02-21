
import React, { useState } from 'react';
import {
    Package,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    AlertCircle,
    XCircle,
    ArrowUpDown,
    Layers,
    Tag,
    BarChart
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminProducts: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 1,
            name: 'Colchão Classe A Gold',
            image: '/assets/products/colchao-gold.jpg',
            category: 'Colchões',
            price: 'R$ 4.590',
            stock: 24,
            status: 'Ativo',
            sales: 158
        },
        {
            id: 2,
            name: 'Acessório Magnético Premium',
            image: '/assets/products/magnetico.jpg',
            category: 'Acessórios',
            price: 'R$ 290',
            stock: 156,
            status: 'Ativo',
            sales: 342
        },
        {
            id: 3,
            name: 'Pillow Top Visco',
            image: '/assets/products/pillow.jpg',
            category: 'Conforto',
            price: 'R$ 890',
            stock: 8,
            status: 'Estoque Baixo',
            sales: 45
        },
        {
            id: 4,
            name: 'Colchão Smart Sleep',
            image: '/assets/products/smart.jpg',
            category: 'Colchões',
            price: 'R$ 3.850',
            stock: 0,
            status: 'Sem Estoque',
            sales: 112
        },
        {
            id: 5,
            name: 'Travesseiro Cervical',
            image: '/assets/products/travesseiro.jpg',
            category: 'Acessórios',
            price: 'R$ 150',
            stock: 85,
            status: 'Ativo',
            sales: 210
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-emerald-50 text-emerald-600';
            case 'Estoque Baixo': return 'bg-amber-50 text-amber-600';
            case 'Sem Estoque': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Produtos</h1>
                        <p className="text-slate-500 font-medium">Controle seu catálogo de produtos, estoque e preços.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all">
                            <Layers className="w-4 h-4" />
                            Categorias
                        </button>
                        <button className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all">
                            <Plus className="w-4 h-4" />
                            Novo Produto
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou categoria..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
                            <Filter className="w-4 h-4 text-[#FBC02D]" />
                            Filtros
                        </button>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-[#05080F] transition-colors">
                                            Produto <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Categoria</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Preço</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Estoque</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map((prod) => (
                                    <tr key={prod.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#05080F] overflow-hidden group-hover:scale-105 transition-transform">
                                                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${prod.name}`} alt={prod.name} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#05080F]">{prod.name}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mt-0.5">
                                                        <BarChart className="w-3 h-3" /> {prod.sales} vendas realizadas
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3 h-3 text-[#FBC02D]" />
                                                <span className="text-sm font-bold text-slate-600">{prod.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 font-black text-[#05080F]">{prod.price}</td>
                                        <td className="py-6 px-4 font-bold text-[#05080F]">
                                            <div className="flex items-center gap-2">
                                                {prod.stock} un.
                                                {prod.stock <= 10 && <AlertCircle className="w-3 h-3 text-amber-500" />}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(prod.status)}`}>
                                                {prod.status === 'Ativo' && <CheckCircle className="w-3 h-3" />}
                                                {prod.status === 'Estoque Baixo' && <AlertCircle className="w-3 h-3" />}
                                                {prod.status === 'Sem Estoque' && <XCircle className="w-3 h-3" />}
                                                {prod.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2 px-2">
                                                <button className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Ver Detalhes">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-[#FBC02D] hover:bg-[#FBC02D]/10 rounded-xl transition-all" title="Editar">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Excluir">
                                                    <Trash2 className="w-5 h-5" />
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
                        <p className="text-sm text-slate-400 font-medium">Mostrando 5 de 48 produtos no catálogo</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">Anterior</button>
                            <button className="px-4 py-2 bg-[#05080F] rounded-xl text-sm font-bold text-white shadow-lg shadow-[#05080F]/10">1</button>
                            <button className="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm font-bold text-[#05080F] transition-all">2</button>
                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#05080F] hover:bg-slate-50 transition-all">Próximo</button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#05080F] rounded-[2rem] p-6 text-white flex items-center gap-5 shadow-xl shadow-[#05080F]/10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Produtos Ativos</p>
                            <h4 className="text-2xl font-black">42</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Produtos Esgotados</p>
                            <h4 className="text-2xl font-black text-[#05080F]">6</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Layers className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categorias Únicas</p>
                            <h4 className="text-2xl font-black text-[#05080F]">8</h4>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
