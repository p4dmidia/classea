import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ShoppingCart,
    Star,
    ShieldCheck,
    Truck,
    ArrowRight,
    Check,
    Loader2,
    Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../components/CartContext';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_categories(name)')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Format data
            const formatted = {
                ...data,
                category: data.product_categories?.name || 'Geral',
                image_url: data.image_url || data.image
            };

            setProduct(formatted);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Produto não encontrado.');
            navigate('/shop');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                <p className="font-bold text-slate-400">Carregando produto...</p>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8">
                <Link to="/shop" className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-[#0B1221] transition-colors mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    VOLTAR PARA LOJA
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/600x600'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-[#FBC02D]/10 text-[#0B1221] text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {product.category}
                                </span>
                                <div className="flex text-emerald-500 gap-1 items-center font-bold text-xs">
                                    <Check className="w-4 h-4" />
                                    Em Estoque
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-[#0B1221] leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-[#FBC02D]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-sm font-bold text-slate-400">(48 avaliações de clientes)</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-black text-[#0B1221]">
                                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-slate-400 font-bold mb-1 line-through">
                                    R$ {(product.price * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {product.description || 'Este produto premium oferece qualidade incomparável e durabilidade, ideal para quem busca o melhor custo-benefício e sofisticação em cada detalhe.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <div className="flex items-center bg-slate-100 rounded-2xl p-1 w-fit">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:text-[#FBC02D] transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-black text-[#0B1221]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:text-[#FBC02D] transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-grow bg-[#FBC02D] hover:bg-[#f9b100] text-[#0B1221] font-black py-4 px-10 rounded-2xl shadow-xl shadow-[#FBC02D]/10 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                ADICIONAR AO CARRINHO
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#FBC02D]">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrega Rápida</p>
                                    <p className="text-sm font-bold text-[#0B1221]">Todo Brasil</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#FBC02D]">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compra Segura</p>
                                    <p className="text-sm font-bold text-[#0B1221]">Garantia Classe A</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
