import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Grid, List, Star, ShoppingCart, Link, Check, Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../components/CartContext';
import toast from 'react-hot-toast';

const ShopPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Todos');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['Todos']);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 20;

    // New Filters
    const [minPrice, setMinPrice] = useState<string>(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('max') || '');
    const [onlyInStock, setOnlyInStock] = useState<boolean>(searchParams.get('stock') === 'true');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const q = searchParams.get('q');
        const cat = searchParams.get('category');
        const min = searchParams.get('min');
        const max = searchParams.get('max');
        const stock = searchParams.get('stock');

        const page = searchParams.get('page');

        if (q !== null) setSearchTerm(q);
        if (cat !== null) setActiveCategory(cat);
        if (min !== null) setMinPrice(min);
        if (max !== null) setMaxPrice(max);
        if (stock !== null) setOnlyInStock(stock === 'true');
        if (page !== null) setCurrentPage(parseInt(page));
        else setCurrentPage(1);

        fetchProducts();
    }, [searchParams]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('name')
                .order('name');

            if (error) throw error;
            if (data) {
                setCategories(['Todos', ...data.map(c => c.name)]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const from = (page - 1) * productsPerPage;
            const to = from + productsPerPage - 1;

            // Using join to filter by category name
            let query = supabase
                .from('products')
                .select(`
                    *,
                    product_categories!inner (
                        name
                    )
                `, { count: 'exact' });

            const cat = searchParams.get('category');
            if (cat && cat !== 'Todos') {
                query = query.eq('product_categories.name', cat);
            }

            const q = searchParams.get('q');
            if (q) {
                query = query.ilike('name', `%${q}%`);
            }

            const min = searchParams.get('min');
            if (min) {
                query = query.gte('price', parseFloat(min));
            }

            const max = searchParams.get('max');
            if (max) {
                query = query.lte('price', parseFloat(max));
            }

            const stock = searchParams.get('stock');
            if (stock === 'true') {
                query = query.gt('stock_quantity', 0);
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                if (!cat || cat === 'Todos') {
                    const fallback = await supabase
                        .from('products')
                        .select(`*, product_categories (name)`, { count: 'exact' })
                        .order('created_at', { ascending: false })
                        .range(from, to);

                    if (fallback.error) throw fallback.error;

                    const formattedFallback = fallback.data?.map(p => ({
                        ...p,
                        category: p.product_categories?.name || 'Sem Categoria',
                        // Fix image URLs if they are comma separated
                        display_image: (p.image_url || p.image || '').split(',')[0].strip?.() || (p.image_url || p.image || '').split(',')[0]
                    }));

                    setProducts(formattedFallback || []);
                    if (fallback.count !== null) {
                        setTotalPages(Math.ceil(fallback.count / productsPerPage));
                    }
                    return;
                }
                throw error;
            }

            const formatted = data?.map(p => ({
                ...p,
                category: p.product_categories?.name || 'Sem Categoria',
                // Fix image URLs if they are comma separated
                display_image: (p.image_url || p.image || '').split(',')[0].trim()
            }));

            setProducts(formatted || []);
            if (count !== null) {
                setTotalPages(Math.ceil(count / productsPerPage));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Erro ao carregar produtos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set('q', searchTerm);
        else params.delete('q');
        setSearchParams(params);
    };

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        if (cat === 'Todos') params.delete('category');
        else params.set('category', cat);
        setSearchParams(params);
        setActiveCategory(cat);
    };

    const applyAdvancedFilters = () => {
        const params = new URLSearchParams(searchParams);
        if (minPrice) params.set('min', minPrice); else params.delete('min');
        if (maxPrice) params.set('max', maxPrice); else params.delete('max');
        if (onlyInStock) params.set('stock', 'true'); else params.delete('stock');
        params.delete('page'); // Reset to page 1 on filter
        setSearchParams(params);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    const handleCopyAffiliateLink = (e: React.MouseEvent, productId: any) => {
        e.stopPropagation();
        const affiliateId = localStorage.getItem('affiliate_id') || 'unregistered';
        const link = `${window.location.origin}/p/${productId}?ref=${affiliateId}`;
        navigator.clipboard.writeText(link);
        setCopiedId(productId);
        toast.success('Link de afiliado copiado!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        addToCart(product);
        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-slate-50 border-b border-slate-100 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-extrabold text-[#0B1221]">Nossa Loja</h1>
                    <p className="text-slate-500 mt-2">Home / Loja {activeCategory !== 'Todos' && `/ ${activeCategory}`}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-[#0B1221] flex items-center gap-2">
                                <Filter className="w-5 h-5 text-[#FBC02D]" />
                                Filtros
                            </h3>
                            <div className="h-1 w-12 bg-[#FBC02D] rounded-full"></div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#0B1221]">Categorias</h4>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`text-sm transition-colors text-left w-full ${activeCategory === cat ? 'text-[#FBC02D] font-bold' : 'text-slate-600 hover:text-[#FBC02D]'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <h4 className="font-semibold text-[#0B1221]">Preço</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="Mín"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs outline-none focus:border-[#FBC02D]"
                                />
                                <input
                                    type="number"
                                    placeholder="Máx"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs outline-none focus:border-[#FBC02D]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="stock-filter"
                                checked={onlyInStock}
                                onChange={(e) => setOnlyInStock(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-200 text-[#FBC02D] focus:ring-[#FBC02D]"
                            />
                            <label htmlFor="stock-filter" className="text-sm text-slate-600 cursor-pointer select-none">
                                Apenas em estoque
                            </label>
                        </div>

                        <button
                            onClick={applyAdvancedFilters}
                            className="w-full bg-[#0B1221] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a253a] transition-colors"
                        >
                            Filtrar
                        </button>
                    </aside>

                    <div className="flex-grow space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <form onSubmit={handleSearch} className="relative max-w-sm w-full">
                                <input
                                    type="text"
                                    placeholder="Pesquisar na loja..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 rounded-lg py-2.5 px-10 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm border border-slate-100"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            </form>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500 whitespace-nowrap">
                                    Página <span className="font-bold text-[#0B1221]">{currentPage}</span> de <span className="font-bold text-[#0B1221]">{totalPages}</span>
                                </span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                                <p className="font-bold text-slate-400">Buscando produtos...</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => navigate(`/p/${product.id}`)}
                                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-[#FBC02D]/10 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                                            <img
                                                src={product.display_image || 'https://via.placeholder.com/400x500'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e: any) => {
                                                    e.target.src = 'https://via.placeholder.com/400x500';
                                                }}
                                            />
                                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                <div
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-[#0B1221] shadow-md -translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-white"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </div>
                                                <div
                                                    onClick={(e) => handleCopyAffiliateLink(e, product.id)}
                                                    className={`bg-white shadow-md rounded-full p-2 -translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all delay-75 cursor-pointer relative ${copiedId === product.id ? 'text-emerald-500' : 'text-[#0B1221] hover:text-[#FBC02D]'}`}
                                                >
                                                    {copiedId === product.id ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{product.category}</span>
                                            <h3 className="font-bold text-[#0B1221] leading-tight group-hover:text-[#FBC02D] transition-colors line-clamp-2">{product.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-[#0B1221]">
                                                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                                <div className="flex text-[#FBC02D]">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="w-full bg-slate-50 border border-slate-100 py-3 rounded-xl text-[#0B1221] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#FBC02D] group-hover:border-[#FBC02D] transition-all"
                                            >
                                                <ShoppingCart className="w-3 h-3" />
                                                Adicionar ao Carrinho
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        )}

                        {!isLoading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-12 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-90" />
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === page ? 'bg-[#FBC02D] text-[#0B1221]' : 'border border-slate-200 text-slate-400 hover:border-[#FBC02D] hover:text-[#FBC02D]'}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronDown className="w-5 h-5 -rotate-90" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
