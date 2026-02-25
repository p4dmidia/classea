
import React, { useState, useEffect } from 'react';
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
    BarChart,
    X,
    Upload,
    DollarSign,
    Box,
    ChevronRight
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminProducts: React.FC = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const itemsPerPage = 5;

    const allProducts = [
        { id: 1, name: 'Colchão Classe A Gold', category: 'Colchões', price: 'R$ 4.590', stock: 24, status: 'Ativo', sales: 158 },
        { id: 2, name: 'Acessório Magnético Premium', category: 'Acessórios', price: 'R$ 290', stock: 156, status: 'Ativo', sales: 342 },
        { id: 3, name: 'Pillow Top Visco', category: 'Conforto', price: 'R$ 890', stock: 8, status: 'Estoque Baixo', sales: 45 },
        { id: 4, name: 'Colchão Smart Sleep', category: 'Colchões', price: 'R$ 3.850', stock: 0, status: 'Sem Estoque', sales: 112 },
        { id: 5, name: 'Travesseiro Cervical', category: 'Acessórios', price: 'R$ 150', stock: 85, status: 'Ativo', sales: 210 },
        { id: 6, name: 'Base Articulada Elite', category: 'Camas', price: 'R$ 5.200', stock: 15, status: 'Ativo', sales: 28 },
        { id: 7, name: 'Protetor de Colchão Impermeável', category: 'Acessórios', price: 'R$ 180', stock: 200, status: 'Ativo', sales: 520 },
        { id: 8, name: 'Lençol de Fios Egípcios', category: 'Enxoval', price: 'R$ 450', stock: 12, status: 'Estoque Baixo', sales: 89 },
    ];

    const categoriesList = [
        { name: 'Colchões', count: 12 },
        { name: 'Acessórios', count: 24 },
        { name: 'Conforto', count: 8 },
        { name: 'Camas', count: 5 },
        { name: 'Enxoval', count: 15 },
    ];

    // Filter Logic
    const filteredProducts = allProducts.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todas' || prod.category === filterCategory;
        const matchesStatus = filterStatus === 'Todos' || prod.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentData = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-emerald-50 text-emerald-600';
            case 'Estoque Baixo': return 'bg-amber-50 text-amber-600';
            case 'Sem Estoque': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const handleToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                handleToast('A imagem deve ter no máximo 5MB');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Produtos</h1>
                        <p className="text-slate-500 font-medium">Controle seu catálogo de produtos, estoque e preços.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCategoriesModalOpen(true)}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all whitespace-nowrap"
                        >
                            <Layers className="w-4 h-4 text-[#FBC02D]" />
                            Categorias
                        </button>
                        <button
                            onClick={() => setIsNewModalOpen(true)}
                            className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 text-[#FBC02D]" />
                            Novo Produto
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative z-20">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou categoria..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-2xl font-bold transition-all text-sm ${isFiltersOpen ? 'bg-[#FBC02D]/10 border-[#FBC02D] text-[#05080F]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Filter className="w-4 h-4 text-[#FBC02D]" />
                            Filtros {(filterStatus !== 'Todos' || filterCategory !== 'Todas') && <span className="w-2 h-2 bg-[#FBC02D] rounded-full"></span>}
                        </button>
                    </div>

                    {/* Advanced Filters Dropdown */}
                    {isFiltersOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Status</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option>Todos</option>
                                        <option>Ativo</option>
                                        <option>Estoque Baixo</option>
                                        <option>Sem Estoque</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Categoria</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        value={filterCategory}
                                        onChange={(e) => {
                                            setFilterCategory(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option>Todas</option>
                                        {categoriesList.map(cat => (
                                            <option key={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Resetar</label>
                                    <button
                                        onClick={() => {
                                            setFilterStatus('Todos');
                                            setFilterCategory('Todas');
                                            setSearchTerm('');
                                            setIsFiltersOpen(false);
                                        }}
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl p-3 text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        Limpar Tudo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                {currentData.length > 0 ? currentData.map((prod) => (
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
                                                <button
                                                    onClick={() => handleToast('Funcionalidade de edição em desenvolvimento.')}
                                                    className="p-2 text-slate-300 hover:text-[#FBC02D] hover:bg-[#FBC02D]/10 rounded-xl transition-all" title="Editar"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleToast('Funcionalidade de exclusão em desenvolvimento.')}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Excluir"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="font-bold">Nenhum produto encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-400 font-medium">Mostrando {currentData.length} de {filteredProducts.length} produtos</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    Anterior
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#05080F] text-white shadow-lg shadow-[#05080F]/10' : 'hover:bg-slate-100 text-[#05080F]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#05080F] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#05080F] rounded-[2rem] p-6 text-white flex items-center gap-5 shadow-xl shadow-[#05080F]/10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Produtos Ativos</p>
                            <h4 className="text-2xl font-black">{allProducts.filter(p => p.status === 'Ativo').length}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Produtos Esgotados</p>
                            <h4 className="text-2xl font-black text-[#05080F]">{allProducts.filter(p => p.status === 'Sem Estoque').length}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Layers className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categorias Únicas</p>
                            <h4 className="text-2xl font-black text-[#05080F]">{categoriesList.length}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Novo Produto Modal */}
            {isNewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsNewModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-[#05080F]">Novo Produto</h2>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Adicionar ao catálogo</p>
                                </div>
                                <button onClick={() => setIsNewModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                setIsNewModalOpen(false);
                                setSelectedImage(null);
                                setImagePreview(null);
                                handleToast('Produto cadastrado com sucesso!');
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome do Produto</label>
                                        <div className="relative">
                                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                            <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]" placeholder="Ex: Colchão Elite" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Categoria</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]">
                                                {categoriesList.map(cat => (
                                                    <option key={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Preço Sugerido</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                            <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]" placeholder="R$ 0,00" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Estoque Inicial</label>
                                        <div className="relative">
                                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                            <input type="number" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]" placeholder="0" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Imagem do Produto</label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/png, image/jpeg, image/webp"
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden min-h-[200px] relative group ${imagePreview ? 'border-emerald-500/30 bg-emerald-50/5' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-[#FBC02D]/50 hover:bg-slate-50/50'}`}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                                                <div className="absolute inset-0 bg-[#05080F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                fileInputRef.current?.click();
                                                            }}
                                                            className="p-3 bg-white text-[#05080F] rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#FBC02D] transition-all"
                                                        >
                                                            <Upload className="w-4 h-4" /> Alterar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="p-3 bg-red-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-red-600 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-10 h-10 text-[#FBC02D]" />
                                                <p className="font-bold text-sm text-slate-500">Arraste a imagem ou clique para selecionar</p>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">PNG, JPG ou WEBP (Max 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-[#05080F] text-white rounded-2xl font-black text-sm mt-6 shadow-2xl shadow-[#05080F]/20 hover:bg-[#1a2436] transition-all flex items-center justify-center gap-3">
                                    CADASTRAR PRODUTO NO CATÁLOGO
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Categorias Modal */}
            {isCategoriesModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsCategoriesModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-[#05080F]">Categorias</h2>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Organização do catálogo</p>
                                </div>
                                <button onClick={() => setIsCategoriesModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {categoriesList.map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-[#FBC02D] transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FBC02D] shadow-sm">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#05080F]">{cat.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} produtos</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#FBC02D] group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50">
                                <button
                                    onClick={() => {
                                        setIsCategoriesModalOpen(false);
                                        handleToast('Funcionalidade de nova categoria em desenvolvimento.');
                                    }}
                                    className="w-full py-5 border-2 border-[#05080F] text-[#05080F] rounded-2xl font-black text-sm hover:bg-[#05080F] hover:text-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-4 h-4" />
                                    ADICIONAR NOVA CATEGORIA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#05080F] text-[#FBC02D] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-black text-sm">
                    <CheckCircle className="w-5 h-5 border-2 border-[#FBC02D] rounded-full" />
                    {toastMessage}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
