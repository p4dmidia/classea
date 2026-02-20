
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dados de login:', formData);
        // Simulating redirect to dashboard
        navigate('/dashboard');
    };

    const handleQuickAccess = () => {
        navigate('/dashboard');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-20 px-4">
            <div className="max-w-md w-full">
                {/* Header/Logo Area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src="/assets/logo.png" alt="Classe A" className="h-24 w-auto drop-shadow-sm" />
                    </div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Bem-vindo de volta!</h1>
                    <p className="text-slate-500 mt-2">Acesse sua conta para gerenciar seus negócios.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
                    <button
                        onClick={handleQuickAccess}
                        className="w-full mb-8 bg-[#FBC02D] hover:bg-[#ffc947] text-[#0B1221] font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#FBC02D]/20 group"
                    >
                        ACESSAR ESCRITÓRIO VIRTUAL (DIRETO)
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative flex items-center py-4 mb-2">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-xs font-black text-slate-300 uppercase tracking-widest">ou use seu login</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">E-mail ou Usuário</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="seu@email.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-[#FBC02D] focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Senha</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#FBC02D] hover:underline">Esqueceu a senha?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 outline-none focus:border-[#FBC02D] focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#0B1221] hover:bg-[#1a2436] text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#0B1221]/20 group">
                            ENTRAR NO SISTEMA
                            <LogIn className="w-5 h-5 text-[#FBC02D] group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Registration Redirect Area */}
                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">Ainda não faz parte do time?</p>
                        <Link to="/register" className="mt-4 inline-flex items-center gap-2 text-[#0B1221] font-black hover:text-[#FBC02D] transition-colors group">
                            CADASTRAR-SE AGORA
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Support Footer */}
                <p className="text-center mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
                    Problemas com acesso? <a href="#" className="text-[#FBC02D]">Suporte Classe A</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
