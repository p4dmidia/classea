
import React, { useState } from 'react';
import { ShieldAlert, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Em um cenário real, aqui seria a chamada para a API
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#05080F] flex items-center justify-center p-6 font-['Inter',_sans-serif]">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#FBC02D]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[440px] relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                {/* Logo/Icon Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] mb-6 backdrop-blur-xl group">
                        <ShieldAlert className="w-10 h-10 text-[#FBC02D] transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Classe A</h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-white/10"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Ambiente Restrito</span>
                        <div className="h-px w-8 bg-white/10"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                    {/* Glowing border effect */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FBC02D]/50 to-transparent opacity-50"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credencial de Acesso</label>
                            <div className="relative group/input">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[#FBC02D] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="admin_id"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-slate-600 outline-none focus:border-[#FBC02D]/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código Identificador</label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[#FBC02D] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-slate-600 outline-none focus:border-[#FBC02D]/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FBC02D] hover:bg-[#ffcd54] text-[#05080F] py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#FBC02D]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-[#05080F]/20 border-t-[#05080F] rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    AUTENTICAR ACESSO
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Warning */}
                    <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
                            Conexão segura e criptografada (SSL). Tentativas de acesso não autorizado serão registradas.
                        </p>
                    </div>
                </div>

                {/* Return Note (Optional/Hidden) */}
                <div className="mt-10 text-center">
                    <p className="text-slate-600 text-xs font-medium">
                        © 2026 CLASSE A - Sistema de Gestão Interna
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
