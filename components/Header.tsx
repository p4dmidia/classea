
import React, { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount } = useCart();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const categories = [
    { label: 'Todos', path: '/shop' },
    { label: 'Colchões', path: '/shop?category=Colchões' },
    { label: 'Acessórios', path: '/shop?category=Acessórios' },
    { label: 'Conforto', path: '/shop?category=Conforto' },
    { label: 'Camas', path: '/shop?category=Camas' },
    { label: 'Enxoval', path: '/shop?category=Enxoval' },
    { label: 'Consórcio', path: '/shop?category=Consórcio', icon: true },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Classe A" className="h-20 w-auto" />
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

        <div className="flex items-center gap-4">
          <Link to="/checkout" className="relative p-2 text-slate-700 hover:text-[#FBC02D] transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/login" className="bg-[#FBC02D] hover:bg-[#f9b100] transition-colors rounded-lg py-2 px-5 flex items-center gap-2 text-sm font-bold text-[#0B1221]">
            <User className="w-4 h-4" />
            Minha Conta
          </Link>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t border-slate-100">
        <div className="container mx-auto px-4 overflow-x-auto">
          <ul className="flex items-center gap-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium">
            {categories.map((cat, idx) => {
              const currentCat = searchParams.get('category') || 'Todos';
              const isActive = (cat.label === 'Todos' && !searchParams.get('category')) || cat.label === currentCat;

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
    </header>
  );
};

export default Header;
