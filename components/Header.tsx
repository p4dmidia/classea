
import React from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const categories = [
    { label: 'Cama (Colchões)', active: true },
    { label: 'Acessórios', active: false },
    { label: 'Vestuário Masculino', active: false },
    { label: 'Calçados Masculino', active: false },
    { label: 'Feminino', active: false },
    { label: 'Infantil', active: false },
    { label: 'Consórcio', active: false, icon: true },
    { label: 'Promoções', active: false, highlight: true },
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
          <Link to="/register" className="hover:text-[#FBC02D]">Cadastre-se</Link>
        </nav>

        <div className="flex-grow max-w-md relative hidden lg:block">
          <input
            type="text"
            placeholder="O que você procura hoje?"
            className="w-full bg-slate-100 rounded-full py-2.5 px-6 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>

        <Link to="/login" className="bg-[#FBC02D] hover:bg-[#f9b100] transition-colors rounded-lg py-2 px-5 flex items-center gap-2 text-sm font-bold text-[#0B1221]">
          <User className="w-4 h-4" />
          Minha Conta
        </Link>
      </div>

      {/* Categories Bar */}
      <div className="border-t border-slate-100">
        <div className="container mx-auto px-4 overflow-x-auto">
          <ul className="flex items-center gap-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className={`flex items-center gap-1 transition-colors ${cat.active ? 'text-[#FBC02D] font-bold border-b-2 border-[#FBC02D] pb-4 -mb-4' :
                    cat.highlight ? 'text-red-500' : 'text-slate-500 hover:text-[#FBC02D]'
                    }`}
                >
                  {cat.icon && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  )}
                  {cat.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
