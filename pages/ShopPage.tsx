
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Grid, List, Star, ShoppingCart } from 'lucide-react';

const ShopPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');

    const categories = ['Todos', 'Cama (Colchões)', 'Acessórios', 'Vestuário', 'Calçados', 'Feminino', 'Infantil'];

    const products = [
        { id: 1, name: 'Colchão Magnético Premium Gold', category: 'Cama (Colchões)', price: 4500, rating: 5, image: 'https://images.unsplash.com/photo-1505693415958-4d5ecf707193?q=80&w=600&auto=format&fit=crop' },
        { id: 2, name: 'Travesseiro Ortopédico ErgoSoft', category: 'Acessórios', price: 280, rating: 4, image: 'https://images.unsplash.com/photo-1632151049159-82ec3fdd8e56?q=80&w=600&auto=format&fit=crop' },
        { id: 3, name: 'Sapato Social Premium Leather', category: 'Calçados', price: 420, rating: 5, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop' },
        { id: 4, name: 'Camisa Polo Executive Fit', category: 'Vestuário', price: 180, rating: 4, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop' },
        { id: 5, name: 'Kit Relaxamento Bio-Magnético', category: 'Acessórios', price: 1200, rating: 5, image: 'https://images.unsplash.com/photo-1544161515-4af6b1d4640d?q=80&w=600&auto=format&fit=crop' },
        { id: 6, name: 'Bolsa Feminina Elegance', category: 'Feminino', price: 350, rating: 4, image: 'https://images.unsplash.com/photo-1584917033904-493bb3c3cc08?q=80&w=600&auto=format&fit=crop' },
    ];

    const filteredProducts = products.filter(p =>
        (activeCategory === 'Todos' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Page Header / Breadcrumbs */}
            <div className="bg-slate-50 border-b border-slate-100 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-extrabold text-[#0B1221]">Nossa Loja</h1>
                    <p className="text-slate-500 mt-2">Home / Loja</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-[#0B1221] flex items-center gap-2">
                                <Filter className="w-5 h-5 text-[#FBC02D]" />
                                Filtros
                            </h3>
                            <div className="h-1 w-12 bg-[#FBC02D] rounded-full"></div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#0B1221]">Categorias</h4>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setActiveCategory(cat)}
                                            className={`text-sm transition-colors ${activeCategory === cat ? 'text-[#FBC02D] font-bold' : 'text-slate-600 hover:text-[#FBC02D]'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range Placeholder */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#0B1221]">Faixa de Preço</h4>
                            <div className="flex items-center gap-4">
                                <input type="number" placeholder="Min" className="w-full bg-slate-100 rounded-lg p-2 text-xs outline-none" />
                                <input type="number" placeholder="Max" className="w-full bg-slate-100 rounded-lg p-2 text-xs outline-none" />
                            </div>
                        </div>

                        {/* Rating Filter Placeholder */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#0B1221]">Avaliação</h4>
                            <div className="space-y-2">
                                {[5, 4, 3].map(stars => (
                                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded text-[#FBC02D] focus:ring-[#FBC02D]" />
                                        <div className="flex text-[#FBC02D]">
                                            {[...Array(stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">ou mais</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Shop Content */}
                    <div className="flex-grow space-y-8">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="relative max-w-sm w-full">
                                <input
                                    type="text"
                                    placeholder="Pesquisar na loja..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 rounded-lg py-2.5 px-10 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm border border-slate-100"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500 whitespace-nowrap">
                                    Mostrando <span className="font-bold text-[#0B1221]">{filteredProducts.length}</span> produtos
                                </span>
                                <div className="flex items-center gap-2 text-slate-400 bg-slate-100 p-1 rounded-lg">
                                    <button className="p-1.5 bg-white rounded-md text-[#0B1221] shadow-sm"><Grid className="w-4 h-4" /></button>
                                    <button className="p-1.5 hover:text-[#0B1221] transition-colors"><List className="w-4 h-4" /></button>
                                </div>
                                <button className="flex items-center gap-2 text-sm font-semibold text-[#0B1221] border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors">
                                    Mais Recentes
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-[#FBC02D]/10 transition-all duration-300">
                                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-[#0B1221] shadow-md -translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                            <ShoppingCart className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{product.category}</span>
                                        <h3 className="font-bold text-[#0B1221] leading-tight group-hover:text-[#FBC02D] transition-colors">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-black text-[#0B1221]">
                                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                            <div className="flex text-[#FBC02D]">
                                                {[...Array(product.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 px-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1221]">Nenhum produto encontrado</h3>
                                <p className="text-slate-500 mt-2">Tente ajustar seus filtros ou mude sua pesquisa.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveCategory('Todos'); }}
                                    className="mt-6 text-[#FBC02D] font-bold hover:underline"
                                >
                                    Limpar todos os filtros
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
