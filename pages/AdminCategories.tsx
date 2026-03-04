import React, { useState, useEffect } from 'react';
import {
    Layers,
    Plus,
    Edit,
    Trash2,
    X,
    Loader2,
    ChevronDown,
    ChevronUp,
    Tag,
    AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Subcategory {
    id: number;
    name: string;
    category_id: number;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    created_at: string;
    subcategories?: Subcategory[];
}

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    // Modal States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Form States
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: catData, error: catError } = await supabase
                .from('product_categories')
                .select('*')
                .order('name');

            if (catError) throw catError;

            const { data: subData, error: subError } = await supabase
                .from('product_subcategories')
                .select('*')
                .order('name');

            if (subError) throw subError;

            const formattedCategories = catData.map(cat => ({
                ...cat,
                subcategories: subData.filter(sub => sub.category_id === cat.id)
            }));

            setCategories(formattedCategories);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Erro ao carregar categorias e subcategorias.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSaving(true);

        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from('product_categories')
                    .update({ name })
                    .eq('id', editingCategory.id);
                if (error) throw error;
                toast.success('Categoria atualizada!');
            } else {
                const { error } = await supabase
                    .from('product_categories')
                    .insert([{ name }]);
                if (error) throw error;
                toast.success('Categoria criada!');
            }
            setIsCategoryModalOpen(false);
            setName('');
            setEditingCategory(null);
            fetchData();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Erro ao salvar categoria.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !selectedCategoryId) return;
        setIsSaving(true);

        try {
            if (editingSubcategory) {
                const { error } = await supabase
                    .from('product_subcategories')
                    .update({ name })
                    .eq('id', editingSubcategory.id);
                if (error) throw error;
                toast.success('Subcategoria atualizada!');
            } else {
                const { error } = await supabase
                    .from('product_subcategories')
                    .insert([{ name, category_id: selectedCategoryId }]);
                if (error) throw error;
                toast.success('Subcategoria criada!');
            }
            setIsSubcategoryModalOpen(false);
            setName('');
            setEditingSubcategory(null);
            fetchData();
        } catch (error) {
            console.error('Error saving subcategory:', error);
            toast.error('Erro ao salvar subcategoria.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Tem certeza? Isso excluirá todas as subcategorias vinculadas e pode afetar produtos.')) return;

        try {
            const { error } = await supabase
                .from('product_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Categoria excluída!');
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Erro ao excluir categoria.');
        }
    };

    const handleDeleteSubcategory = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir esta subcategoria?')) return;

        try {
            const { error } = await supabase
                .from('product_subcategories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Subcategoria excluída!');
            fetchData();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            toast.error('Erro ao excluir subcategoria.');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Categorias e Subcategorias</h1>
                        <p className="text-slate-500 font-medium">Organize seu catálogo de produtos em múltiplos níveis.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setName('');
                            setIsCategoryModalOpen(true);
                        }}
                        className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 text-[#FBC02D]" />
                        Nova Categoria
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                            <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Nenhuma categoria cadastrada.</p>
                        </div>
                    ) : (
                        categories.map(category => (
                            <div key={category.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="p-6 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}>
                                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-[#FBC02D]">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#05080F]">{category.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.subcategories?.length || 0} Subcategorias</p>
                                        </div>
                                        {expandedCategory === category.id ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategoryId(category.id);
                                                setEditingSubcategory(null);
                                                setName('');
                                                setIsSubcategoryModalOpen(true);
                                            }}
                                            className="p-2 text-[#FBC02D] hover:bg-amber-50 rounded-lg transition-all"
                                            title="Adicionar Subcategoria"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setName(category.name);
                                                setIsCategoryModalOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-[#05080F] hover:bg-slate-100 rounded-lg transition-all"
                                            title="Editar Categoria"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Excluir Categoria"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {expandedCategory === category.id && (
                                    <div className="p-4 bg-white divide-y divide-slate-50 animate-in slide-in-from-top-2 duration-300">
                                        {category.subcategories && category.subcategories.length > 0 ? (
                                            category.subcategories.map(subcategory => (
                                                <div key={subcategory.id} className="flex items-center justify-between py-3 px-4 hover:bg-slate-50/50 rounded-xl transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <Tag className="w-3 h-3 text-[#FBC02D]" />
                                                        <span className="text-sm font-bold text-slate-600">{subcategory.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingSubcategory(subcategory);
                                                                setName(subcategory.name);
                                                                setSelectedCategoryId(category.id);
                                                                setIsSubcategoryModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-slate-300 hover:text-[#05080F] transition-all"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSubcategory(subcategory.id)}
                                                            className="p-1.5 text-red-200 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center text-xs font-bold text-slate-400">
                                                Nenhuma subcategoria para esta categoria.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSaveCategory} className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-[#05080F]">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome da Categoria</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        placeholder="Ex: Masculino"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-[#05080F] text-white rounded-xl font-black text-sm shadow-xl hover:bg-[#1a2436] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CONFIRMAR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Subcategory Modal */}
            {isSubcategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsSubcategoryModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSaveSubcategory} className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-[#05080F]">{editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}</h2>
                                <button type="button" onClick={() => setIsSubcategoryModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-2 flex items-start gap-3">
                                    <AlertCircle className="w-4 h-4 text-[#FBC02D] mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Categoria Selecionada</p>
                                        <p className="text-xs font-bold text-amber-900">{categories.find(c => c.id === selectedCategoryId)?.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome da Subcategoria</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        placeholder="Ex: Camisas"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-[#05080F] text-white rounded-xl font-black text-sm shadow-xl hover:bg-[#1a2436] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CONFIRMAR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCategories;
