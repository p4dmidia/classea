
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from './CartContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount } = useCart();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const [categories, setCategories] = useState<{ label: string; path: string; icon?: boolean; id?: number }[]>([
    { label: 'Todos', path: '/shop' }
  ]);

  React.useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      // Fetch only top level categories (parent_id is null) for the organization
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name')
        .is('parent_id', null)
        .eq('organization_id', '5111af72-27a5-41fd-8ed9-8c51b78b4fdd')
        .order('name');

      if (error) throw error;

      if (data) {
        const dynamicCats = data.map(cat => ({
          label: cat.name,
          path: `/shop?category_id=${cat.id}`,
          id: cat.id
        }));
        setCategories([
          { label: 'Todos', path: '/shop' },
          ...dynamicCats,
          { label: 'Consórcio', path: '/consorcio', icon: true } 
        ]);
      }
    } catch (error) {
      console.error('Error fetching header categories:', error);
      // Fallback to basic categories if error
      setCategories([
        { label: 'Todos', path: '/shop' },
        { label: 'Colchões', path: '/shop?category_id=49' },
        { label: 'Calçados', path: '/shop?category_id=19' },
        { label: 'Vestuário', path: '/shop?category_id=5' },
        { label: 'Acessórios', path: '/shop?category_id=1' }
      ]);
    }
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <img src="/assets/logo.png" alt="Classe A" className="h-16 md:h-20 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link to="/" className="hover:text-[#FBC02D]">Home</Link>
          <Link to="/shop" className="hover:text-[#FBC02D]">Loja</Link>
          <Link to="/consorcio" className="hover:text-[#FBC02D]">Consórcio</Link>
          <Link to="/register" className="hover:text-[#FBC02D]">Cadastre-se</Link>
        </nav>

        <form onSubmit={handleSearch} className="flex-grow max-w-md relative hidden lg:block">
          <input
            type="text"
            placeholder="O que você procura hoje?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-slate-100 rounded-full py-2.5 px-6 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FBC02D] transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/checkout" className="relative p-2 text-slate-700 hover:text-[#FBC02D] transition-colors">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/login" className="hidden sm:flex bg-[#FBC02D] hover:bg-[#f9b100] transition-colors rounded-lg py-2 px-3 md:px-5 items-center gap-2 text-xs md:text-sm font-bold text-[#0B1221]">
            <User className="w-4 h-4" />
            Minha Conta
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#FBC02D] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories Bar - Desktop Only */}
      <div className="border-t border-slate-100 hidden md:block">
        <div className="container mx-auto px-4 overflow-x-auto">
          <ul className="flex items-center gap-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium">
            {categories.map((cat, idx) => {
              const currentCatId = searchParams.get('category_id');
              const isPathActive = window.location.pathname === cat.path;
              const isActive = (cat.label === 'Todos' && !currentCatId && window.location.pathname === '/shop') || 
                               (cat.id && currentCatId === cat.id.toString()) ||
                               (cat.path === '/consorcio' && window.location.pathname === '/consorcio');

              return (
                <li key={idx}>
                  <Link
                    to={cat.path}
                    className={`flex items-center gap-1 transition-colors ${isActive ? 'text-[#FBC02D] font-bold border-b-2 border-[#FBC02D] pb-4 -mb-4' :
                      'text-slate-500 hover:text-[#FBC02D]'
                      }`}
                  >
                    {cat.icon && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M12 8v8M8 12h8" />
                      </svg>
                    )}
                    {cat.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-50 bg-[#0B1221] transition-transform duration-300 md:hidden
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <img src="/assets/logo.png" alt="Classe A" className="h-12 w-auto brightness-0 invert" />
            <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
              <X className="w-8 h-8" />
            </button>
          </div>

          <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative mb-8">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#FBC02D]/50"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
              <Search className="w-6 h-6" />
            </button>
          </form>

          <nav className="flex flex-col gap-6 text-xl font-black text-white mb-12">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FBC02D]">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FBC02D]">Loja</Link>
            <Link to="/consorcio" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FBC02D]">Consórcio</Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FBC02D]">Cadastre-se</Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#FBC02D]">
              <User className="w-6 h-6" />
              Minha Conta
            </Link>
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Categorias</p>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/70 hover:text-[#FBC02D] text-sm font-bold py-2"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
