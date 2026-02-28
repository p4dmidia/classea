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
    ChevronRight,
    Loader2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    description: string;
    category_id: number;
    price: number;
    stock_quantity: number;
    image_url: string;
    is_active: boolean;
    sales_count: number;
    created_at: string;
    product_categories?: {
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
    _count?: {
        products: number;
    };
}

const AdminProducts: React.FC = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCategorySaving, setIsCategorySaving] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock_quantity: '',
        description: ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchProducts(), fetchCategories()]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_categories (name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Erro ao carregar produtos');
            console.error(error);
        } else {
            setProducts(data || []);
        }
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('product_categories')
            .select(`
                *,
                products (id)
            `);

        if (error) {
            toast.error('Erro ao carregar categorias');
        } else {
            const formatted = data.map((cat: any) => ({
                ...cat,
                count: cat.products?.length || 0
            }));
            setCategories(formatted);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setIsCategorySaving(true);

        try {
            const { error } = await supabase
                .from('product_categories')
                .insert([{ name: newCategoryName }]);

            if (error) throw error;

            toast.success('Categoria adicionada!');
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            toast.error('Erro ao adicionar categoria');
            console.error(error);
        } finally {
            setIsCategorySaving(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Tem certeza? Isso pode afetar produtos vinculados.')) return;

        try {
            const { error } = await supabase
                .from('product_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Categoria removida');
            fetchCategories();
            fetchProducts();
        } catch (error) {
            toast.error('Erro ao excluir categoria');
        }
    };

    const handleOpenEdit = (prod: Product) => {
        setEditingProduct(prod);
        setFormData({
            name: prod.name,
            category_id: prod.category_id.toString(),
            price: prod.price.toString(),
            stock_quantity: prod.stock_quantity.toString(),
            description: prod.description || ''
        });
        setImagePreview(prod.image_url);
        setIsNewModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let imageUrl = editingProduct?.image_url || '';

            if (selectedImage) {
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError, data } = await supabase.storage
                    .from('product-images')
                    .upload(`products/${fileName}`, selectedImage);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(data.path);

                imageUrl = publicUrl;
            }

            // Cleanup price: remove R$, dots and replace comma with dot
            const rawPrice = formData.price.toString().replace(/[R$\s.]/g, '').replace(',', '.');
            const parsedPrice = parseFloat(rawPrice);

            if (isNaN(parsedPrice)) {
                toast.error('Preço inválido');
                setIsSaving(false);
                return;
            }

            const productData = {
                name: formData.name,
                category_id: parseInt(formData.category_id),
                price: parsedPrice,
                stock_quantity: parseInt(formData.stock_quantity),
                description: formData.description,
                image_url: imageUrl,
                is_active: true
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
                toast.success('Produto atualizado com sucesso!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
                toast.success('Produto cadastrado com sucesso!');
            }

            setIsNewModalOpen(false);
            resetForm();
            fetchProducts();
            fetchCategories();
        } catch (error: any) {
            toast.error(editingProduct ? 'Erro ao atualizar produto' : 'Erro ao cadastrar produto');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Produto removido');
            fetchProducts();
            fetchCategories();
        } catch (error) {
            toast.error('Erro ao excluir produto');
        }
    };

    const toggleProductStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Produto ${!currentStatus ? 'ativado' : 'desativado'}`);
            fetchProducts();
        } catch (error) {
            toast.error('Erro ao atualizar status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category_id: '',
            price: '',
            stock_quantity: '',
            description: ''
        });
        setEditingProduct(null);
        setSelectedImage(null);
        setImagePreview(null);
    };

    // Filter Logic
    const filteredProducts = products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = prod.product_categories?.name || 'Sem Categoria';
        const matchesCategory = filterCategory === 'Todas' || categoryName === filterCategory;

        let statusText = 'Ativo';
        if (!prod.is_active) statusText = 'Inativo';
        else if (prod.stock_quantity === 0) statusText = 'Sem Estoque';
        else if (prod.stock_quantity <= 10) statusText = 'Estoque Baixo';

        const matchesStatus = filterStatus === 'Todos' || statusText === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentData = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusInfo = (prod: Product) => {
        if (!prod.is_active) return { text: 'Inativo', color: 'bg-slate-50 text-slate-600' };
        if (prod.stock_quantity === 0) return { text: 'Sem Estoque', color: 'bg-red-50 text-red-600' };
        if (prod.stock_quantity <= 10) return { text: 'Estoque Baixo', color: 'bg-amber-50 text-amber-600' };
        return { text: 'Ativo', color: 'bg-emerald-50 text-emerald-600' };
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('A imagem deve ter no máximo 5MB');
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
                            onClick={() => {
                                resetForm();
                                setIsNewModalOpen(true);
                            }}
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
                            placeholder="Buscar por nome..."
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
                                        <option>Inativo</option>
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
                                        {categories.map(cat => (
                                            <option key={cat.id}>{cat.name}</option>
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

                {/* Products Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Produto</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Categoria</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Preço</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Estoque</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-6 px-8"><div className="h-14 w-full bg-slate-100 rounded-2xl"></div></td>
                                            <td className="py-6 px-4"><div className="h-6 w-24 bg-slate-100 rounded-full"></div></td>
                                            <td className="py-6 px-4"><div className="h-6 w-20 bg-slate-100 rounded-lg"></div></td>
                                            <td className="py-6 px-4"><div className="h-6 w-16 bg-slate-100 rounded-lg"></div></td>
                                            <td className="py-6 px-4"><div className="h-8 w-24 bg-slate-100 rounded-full mx-auto"></div></td>
                                            <td className="py-6 px-8"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : currentData.length > 0 ? currentData.map((prod) => {
                                    const statusInfo = getStatusInfo(prod);
                                    return (
                                        <tr key={prod.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#05080F] overflow-hidden">
                                                        {prod.image_url ? (
                                                            <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-6 h-6 text-[#FBC02D]" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#05080F]">{prod.name}</p>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mt-0.5">
                                                            <BarChart className="w-3 h-3 text-[#FBC02D]" /> {prod.sales_count} vendas
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className="text-sm font-bold text-slate-600">{prod.product_categories?.name || 'Sem Categoria'}</span>
                                            </td>
                                            <td className="py-6 px-4 font-black text-[#05080F]">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                                            </td>
                                            <td className="py-6 px-4 font-bold text-[#05080F]">
                                                {prod.stock_quantity} un.
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusInfo.color}`}>
                                                    {statusInfo.text}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(prod)}
                                                        className="p-2 text-slate-300 hover:text-[#FBC02D] hover:bg-[#FBC02D]/10 rounded-xl transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleProductStatus(prod.id, prod.is_active)}
                                                        className={`p-2 rounded-xl transition-all ${prod.is_active ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                        title={prod.is_active ? 'Desativar' : 'Ativar'}
                                                    >
                                                        {prod.is_active ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
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
                    {totalPages > 1 && (
                        <div className="p-8 border-t border-slate-50 flex justify-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#05080F] text-white shadow-lg shadow-[#05080F]/10' : 'hover:bg-slate-100 text-[#05080F]'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Novo/Editar Produto Modal */}
            {isNewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsNewModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <form className="p-8 md:p-12 mb-0" onSubmit={handleSaveProduct}>
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-[#05080F]">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{editingProduct ? 'Atualizar catálogo' : 'Adicionar ao catálogo'}</p>
                                </div>
                                <button type="button" onClick={() => setIsNewModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome do Produto</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                            placeholder="Ex: Colchão Elite"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Categoria</label>
                                        <select
                                            required
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        >
                                            <option value="">Selecionar...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Preço</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                            placeholder="R$ 0,00"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Estoque</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock_quantity}
                                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Descrição</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] min-h-[100px]"
                                        placeholder="Detalhes do produto..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Imagem</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${imagePreview ? 'border-[#FBC02D]/30 bg-amber-50/5' : 'border-slate-100 bg-slate-50 hover:border-[#FBC02D]/50'}`}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-32 rounded-xl object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-[#FBC02D]" />
                                                <p className="text-xs font-bold text-slate-400">Clique para subir imagem</p>
                                            </>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-[#05080F] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[#1a2436] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingProduct ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Gestão de Categorias */}
            {isCategoriesModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsCategoriesModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#05080F]">Categorias</h2>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Gerenciar classificações</p>
                                </div>
                                <button onClick={() => setIsCategoriesModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddCategory} className="mb-8 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nova categoria..."
                                    className="flex-grow bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] text-sm"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isCategorySaving}
                                    className="bg-[#05080F] text-white p-3 rounded-xl font-bold hover:bg-[#1a2436] transition-all disabled:opacity-50"
                                >
                                    {isCategorySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                                </button>
                            </form>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                                <Tag className="w-4 h-4 text-[#FBC02D]" />
                                            </div>
                                            <span className="font-bold text-[#05080F]">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
