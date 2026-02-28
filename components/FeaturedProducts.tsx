import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, Bookmark, Loader2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories (name)
        `)
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = data?.map(p => ({
        ...p,
        category: p.product_categories?.name || 'Destaque'
      }));

      setProducts(formatted || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0B1221]">Produtos em Destaque</h2>
            <p className="text-slate-400 mt-2">As melhores escolhas para o seu bem-estar.</p>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-[#FBC02D] font-bold text-sm hover:underline">
            Ver tudo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#FBC02D] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/p/${product.id}`)}
                className="group flex flex-col h-full bg-white border border-slate-100 rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={product.image_url || product.image || 'https://via.placeholder.com/400x400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.category === 'Destaque' && (
                    <span className="absolute top-4 left-4 bg-[#FBC02D] text-[#0B1221] text-[10px] font-black px-2 py-1 rounded">
                      DESTAQUE
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 mb-2 truncate group-hover:text-[#FBC02D] transition-colors">{product.name}</h3>
                  <div className="mt-auto">
                    <span className="text-[#FBC02D] font-black text-xl">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                      MMN: DISPONÍVEL PARA AFILIADOS
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-grow bg-[#0B1221] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
