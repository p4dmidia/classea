
import React from 'react';
import { ShoppingCart, ArrowRight, Bookmark } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Colchão Magnético ...',
    price: 4500.00,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop',
    badge: 'DESTAQUE',
  },
  {
    id: 2,
    name: 'Tênis Casual Couro',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Camisa Polo Slim Fit',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1625910513397-2404323e0477?q=80&w=1471&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Relógio de Pulso Gold',
    price: 890.00,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1480&auto=format&fit=crop',
    isHot: true,
  }
];

const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0B1221]">Produtos em Destaque</h2>
            <p className="text-slate-400 mt-2">As melhores escolhas para o seu bem-estar.</p>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#FBC02D] font-bold text-sm">
            Ver tudo <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col h-full bg-white border border-slate-100 rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#FBC02D] text-[#0B1221] text-[10px] font-black px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                {product.isHot && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded">
                    HOT
                  </span>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 mb-2 truncate">{product.name}</h3>
                <div className="mt-auto">
                  <span className="text-[#FBC02D] font-black text-xl">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                    MMN: DISPONÍVEL PARA AFILIADOS
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    <button className="flex-grow bg-[#0B1221] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                      Comprar
                    </button>
                    <button className="bg-slate-100 hover:bg-[#FBC02D]/10 text-slate-500 hover:text-[#FBC02D] p-2.5 rounded-lg transition-all">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
