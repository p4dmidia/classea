import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    Send,
    User,
    Lock,
    Mail,
    AtSign,
    Briefcase,
    ShoppingCart,
    FileText,
    Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [registrationType, setRegistrationType] = useState<'business' | 'sales' | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        login: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        aceiteContrato: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!registrationType) {
            setError('Por favor, selecione o tipo de cadastro.');
            return;
        }
        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        if (!formData.aceiteContrato) {
            setError('Você precisa aceitar os termos do contrato para prosseguir.');
            return;
        }

        setLoading(true);
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.senha,
                options: {
                    data: {
                        nome: formData.nome,
                        sobrenome: formData.sobrenome,
                        login: formData.login,
                        registration_type: registrationType,
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data?.user) {
                toast.success('Cadastro realizado com sucesso! Bem-vindo à Classe A.', {
                    duration: 5000,
                    style: {
                        background: '#0B1221',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '1rem',
                        border: '1px solid rgba(251, 192, 45, 0.2)'
                    },
                    iconTheme: {
                        primary: '#FBC02D',
                        secondary: '#0B1221',
                    },
                });

                // Redirecionar para login após um pequeno delay para o usuário ver o toast
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao realizar cadastro.');
            toast.error(err.message || 'Erro ao realizar cadastro.');
            console.error('Erro no cadastro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero simplified */}
            <section className="relative overflow-hidden bg-[#0B1221] py-16 lg:py-24">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FBC02D]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block bg-[#FBC02D]/20 text-[#FBC02D] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6">
                        Seja um Parceiro Classe A
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Crie sua conta e comece <br />
                        <span className="text-[#FBC02D]">sua jornada de sucesso</span>
                    </h1>
                </div>
            </section>

            {/* Registration Form Section */}
            <section className="py-20 -mt-16 relative z-20 pb-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Side: Type Selection */}
                                    <div className="lg:w-1/3 bg-slate-50 p-8 lg:p-12 space-y-8 border-r border-slate-100">
                                        <div>
                                            <h3 className="text-xl font-black text-[#0B1221] mb-2">Tipo de Cadastro</h3>
                                            <p className="text-slate-500 text-xs font-medium">Selecione como deseja atuar na plataforma.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                type="button"
                                                onClick={() => setRegistrationType('business')}
                                                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${registrationType === 'business'
                                                    ? 'border-[#FBC02D] bg-white shadow-lg shadow-[#FBC02D]/10'
                                                    : 'border-slate-200 hover:border-slate-300 bg-transparent'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${registrationType === 'business' ? 'bg-[#FBC02D] text-[#0B1221]' : 'bg-slate-200 text-slate-500'}`}>
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <p className="font-black text-[#0B1221] text-sm leading-none">PARA NEGÓCIO</p>
                                                <p className="text-[10px] text-slate-400 font-black mt-1.5 leading-relaxed uppercase tracking-widest">Diamante (7 gerações)</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setRegistrationType('sales')}
                                                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${registrationType === 'sales'
                                                    ? 'border-[#FBC02D] bg-white shadow-lg shadow-[#FBC02D]/10'
                                                    : 'border-slate-200 hover:border-slate-300 bg-transparent'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${registrationType === 'sales' ? 'bg-[#FBC02D] text-[#0B1221]' : 'bg-slate-200 text-slate-500'}`}>
                                                    <ShoppingCart className="w-5 h-5" />
                                                </div>
                                                <p className="font-black text-[#0B1221] text-sm leading-none">PARA VENDAS</p>
                                                <p className="text-[10px] text-slate-400 font-black mt-1.5 leading-relaxed uppercase tracking-widest">Somente vendedor</p>
                                            </button>
                                        </div>

                                        <div className="pt-8 border-t border-slate-200">
                                            <div className="flex items-center gap-3 text-emerald-500 bg-emerald-50 p-4 rounded-xl border border-emerald-100/50">
                                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Cadastro Gratuito</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Basic Info */}
                                    <div className="lg:w-2/3 p-8 lg:p-12 space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-[#0B1221] mb-2">Informações de Acesso</h3>
                                            <p className="text-slate-400 text-sm font-medium">Preencha os campos básicos solicitados.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Nome</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="text" name="nome" required
                                                        value={formData.nome} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all"
                                                        placeholder="Ex: João"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Sobrenome</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="text" name="sobrenome" required
                                                        value={formData.sobrenome} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all"
                                                        placeholder="Silva"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 flex justify-between">
                                                    CRIE SEU LOGIN (USUÁRIO)
                                                </label>
                                                <div className="relative">
                                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="text" name="login" required
                                                        value={formData.login} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all uppercase"
                                                        placeholder="joaosilva2024"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest pl-1">Link de indicação: classea.com/{formData.login || 'seu-login'}</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">E-mail</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="email" name="email" required
                                                        value={formData.email} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all"
                                                        placeholder="exemplo@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Senha</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="password" name="senha" required
                                                        value={formData.senha} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all"
                                                        placeholder="********"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Confirmar Senha</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                                                    <input
                                                        type="password" name="confirmarSenha" required
                                                        value={formData.confirmarSenha} onChange={handleChange}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#05080F] outline-none focus:border-[#FBC02D] transition-all"
                                                        placeholder="********"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contract Acceptance Section */}
                                        <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                                    <FileText className="w-6 h-6 text-[#FBC02D]" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-black text-sm text-[#0B1221]">Contrato de Afiliação</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Leia as regras de bonificação e termos de uso</p>
                                                    <button type="button" className="flex items-center gap-2 text-[#0B1221] text-[10px] font-black hover:text-[#FBC02D] transition-colors bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm uppercase tracking-widest">
                                                        <Download className="w-3.5 h-3.5" /> BAIXAR PDF
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setFormData(p => ({ ...p, aceiteContrato: !p.aceiteContrato }))}
                                                className="flex items-center gap-4 cursor-pointer group select-none"
                                            >
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.aceiteContrato ? 'bg-[#FBC02D] border-[#FBC02D]' : 'bg-white border-slate-200 group-hover:border-slate-300'}`}>
                                                    {formData.aceiteContrato && <CheckCircle2 size={16} className="text-[#0B1221]" />}
                                                </div>
                                                <span className="text-[10px] font-black text-[#0B1221] uppercase tracking-widest">
                                                    Li e aceito todas as regras do negócio
                                                </span>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-5 bg-[#0B1221] text-white rounded-2xl font-black text-sm shadow-2xl shadow-[#0B1221]/20 hover:bg-[#1a2436] transition-all flex items-center justify-center gap-3 uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA AGORA'}
                                            <Send className="w-5 h-5 text-[#FBC02D]" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            Classe A © 2026 - Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegisterPage;
