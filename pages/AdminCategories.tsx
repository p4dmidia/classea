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

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    created_at: string;
    children?: Category[];
}

// Helper Component for Recursive Rendering
const CategoryTreeList: React.FC<{
    nodes: Category[];
    onEdit: (cat: Category) => void;
    onDelete: (id: number) => void;
    onAddSub: (parentId: number) => void;
    level?: number;
}> = ({ nodes, onEdit, onDelete, onAddSub, level = 0 }) => {
    return (
        <div className={`space-y-4 ${level > 0 ? 'ml-8 mt-4 border-l-2 border-slate-50 pl-6' : ''}`}>
            {nodes.map(node => (
                <div key={node.id} className="space-y-4">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-[#FBC02D]">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#05080F]">{node.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        ID: {node.id} | {node.children?.length || 0} Subcategorias
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onAddSub(node.id)}
                                    className="p-2 text-[#FBC02D] hover:bg-amber-50 rounded-lg transition-all"
                                    title="Adicionar Subcategoria"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onEdit(node)}
                                    className="p-2 text-slate-400 hover:text-[#05080F] hover:bg-slate-100 rounded-lg transition-all"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onDelete(node.id)}
                                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {node.children && node.children.length > 0 && (
                        <CategoryTreeList
                            nodes={node.children}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSub={onAddSub}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// Helper to flatten tree for select dropdown
const categoriesToSelect = (nodes: Category[], prefix = ''): { id: number, name: string }[] => {
    let list: { id: number, name: string }[] = [];
    nodes.forEach(node => {
        list.push({ id: node.id, name: prefix + node.name });
        if (node.children) {
            list = [...list, ...categoriesToSelect(node.children, prefix + node.name + ' > ')];
        }
    });
    return list;
};

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);

    // Form States
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('name');

            if (error) throw error;

            // Build hierarchical structure for display
            const buildTree = (cats: any[]): Category[] => {
                const map = new Map<number | null, Category[]>();
                cats.forEach(cat => {
                    if (!map.has(cat.parent_id)) map.set(cat.parent_id, []);
                    map.get(cat.parent_id)!.push({ ...cat, children: [] });
                });

                const resolveChildren = (parentId: number | null): Category[] => {
                    const children = map.get(parentId) || [];
                    return children.map(child => ({
                        ...child,
                        children: resolveChildren(child.id)
                    }));
                };

                return resolveChildren(null);
            };

            setCategories(buildTree(data || []));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Erro ao carregar categorias.');
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
                    .update({ name, parent_id: parentCategoryId })
                    .eq('id', editingCategory.id);
                if (error) throw error;
                toast.success('Categoria atualizada!');
            } else {
                const { error } = await supabase
                    .from('product_categories')
                    .insert([{ name, parent_id: parentCategoryId }]);
                if (error) throw error;
                toast.success('Categoria criada!');
            }
            setIsModalOpen(false);
            setName('');
            setParentCategoryId(null);
            setEditingCategory(null);
            fetchData();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Erro ao salvar categoria.');
        } finally {
            setIsSaving(false);
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
                            setParentCategoryId(null);
                            setName('');
                            setIsModalOpen(true);
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
                        <CategoryTreeList
                            nodes={categories}
                            onEdit={(cat) => {
                                setEditingCategory(cat);
                                setName(cat.name);
                                setParentCategoryId(cat.parent_id);
                                setIsModalOpen(true);
                            }}
                            onDelete={async (id) => {
                                if (!window.confirm('Tem certeza? Isso excluirá todas as subcategorias vinculadas.')) return;
                                try {
                                    const { error } = await supabase.from('product_categories').delete().eq('id', id);
                                    if (error) throw error;
                                    toast.success('Categoria excluída!');
                                    fetchData();
                                } catch (e) { toast.error('Erro ao excluir.'); }
                            }}
                            onAddSub={(parentId) => {
                                setEditingCategory(null);
                                setParentCategoryId(parentId);
                                setName('');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Combined Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSaveCategory} className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-[#05080F]">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-xl">
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
                                        placeholder="Ex: Camisa Social"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Categoria Pai (Opcional)</label>
                                    <select
                                        value={parentCategoryId || ''}
                                        onChange={(e) => setParentCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                    >
                                        <option value="">Nenhuma (Categoria Raiz)</option>
                                        {/* Flattened categories list for select */}
                                        {categoriesToSelect(categories).map(cat => (
                                            <option key={cat.id} value={cat.id} disabled={cat.id === editingCategory?.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
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
