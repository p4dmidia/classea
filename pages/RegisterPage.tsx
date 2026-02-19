
import React, { useState } from 'react';
import { Target, TrendingUp, Users, ShieldCheck, CheckCircle2, Send } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        whatsapp: '',
        cidade: '',
        estado: '',
        endereco: '',
        senha: '',
        chavePix: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Cadastro enviado com sucesso! Nossa equipe entrará em contato.');
        console.log('Dados do formulário:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#0B1221] py-20 lg:py-32">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FBC02D]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto px-4 relative z-10 text-center lg:text-left grid lg:grid-cols-2 items-center gap-12">
                    <div className="space-y-8">
                        <span className="inline-block bg-[#FBC02D]/20 text-[#FBC02D] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                            Oportunidade de Negócio
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Torne-se um Empreendedor <br />
                            <span className="text-[#FBC02D]">Classe A</span> e mude sua vida!
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto lg:mx-0">
                            Faça parte da maior rede de empreendedorismo premium do Brasil. Produtos de alta demanda, lucratividade agressiva e um plano de carreira real.
                        </p>
                        <div className="pt-4">
                            <a href="#cadastro" className="bg-[#FBC02D] hover:bg-[#f9b100] text-[#0B1221] font-black py-5 px-12 rounded-xl text-lg transition-all shadow-xl shadow-[#FBC02D]/20 inline-block">
                                QUERO ME CADASTRAR AGORA
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
                            alt="Equipe Classe A"
                            className="rounded-3xl object-cover h-[500px] w-full border border-white/10"
                        />
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-[#0B1221]">Os Pilares do Sucesso</h2>
                        <div className="h-1.5 w-24 bg-[#FBC02D] mx-auto rounded-full"></div>
                        <p className="text-slate-500 text-lg">Três motivos fundamentais para você iniciar sua jornada conosco hoje mesmo.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-3xl border border-slate-100 bg-slate-50 space-y-6 hover:border-[#FBC02D]/50 transition-colors">
                            <div className="w-14 h-14 bg-[#FBC02D] rounded-2xl flex items-center justify-center text-[#0B1221] shadow-lg shadow-[#FBC02D]/20">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0B1221]">Produtos Premium</h3>
                            <p className="text-slate-500 leading-relaxed">Colchões magnéticos e acessórios de alta tecnologia com aceitação imediata no mercado.</p>
                        </div>

                        <div className="p-10 rounded-3xl border border-slate-100 bg-slate-50 space-y-6 hover:border-[#FBC02D]/50 transition-colors">
                            <div className="w-14 h-14 bg-[#FBC02D] rounded-2xl flex items-center justify-center text-[#0B1221] shadow-lg shadow-[#FBC02D]/20">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0B1221]">Plano de Carreira</h3>
                            <p className="text-slate-500 leading-relaxed">Ganhos recorrentes e bônus por produtividade. O seu esforço é recompensado acima da média.</p>
                        </div>

                        <div className="p-10 rounded-3xl border border-slate-100 bg-slate-50 space-y-6 hover:border-[#FBC02D]/50 transition-colors">
                            <div className="w-14 h-14 bg-[#FBC02D] rounded-2xl flex items-center justify-center text-[#0B1221] shadow-lg shadow-[#FBC02D]/20">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0B1221]">Suporte Total</h3>
                            <p className="text-slate-500 leading-relaxed">Treinamentos constantes, mentorias com líderes e materiais de marketing profissionais.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-[#FFFBEB]">
                <div className="container mx-auto px-4 grid lg:grid-cols-2 items-center gap-16">
                    <div className="order-2 lg:order-1 relative">
                        <img
                            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1470&auto=format&fit=crop"
                            alt="Reunião de Sucesso"
                            className="rounded-3xl shadow-2xl relative z-10"
                        />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FBC02D] rounded-3xl -z-10 rotate-12"></div>
                    </div>
                    <div className="space-y-8 order-1 lg:order-2">
                        <h2 className="text-4xl font-black text-[#0B1221] leading-tight">Um modelo de negócio testado e aprovado.</h2>
                        <div className="space-y-4">
                            {[
                                'Comissões imediatas sobre vendas diretas',
                                'Bônus de liderança sobre equipe',
                                'Premiações por metas alcançadas',
                                'Liberdade de horário e localização'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-500 w-6 h-6 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100">
                            <ShieldCheck className="w-10 h-10 text-[#FBC02D]" />
                            <div>
                                <p className="font-bold text-[#0B1221]">Empresa 100% Brasileira</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Segurança e Tradição</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Form Section */}
            <section id="cadastro" className="py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-[#0B1221] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row shadow-[#0B1221]/40">
                            <div className="lg:w-2/5 bg-[#FBC02D] p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-[#0B1221]">Inicie sua jornada</h3>
                                    <p className="text-[#0B1221]/70 font-medium">Preencha os dados e um de nossos gestores entrará em contato com você em breve.</p>
                                </div>
                                <div className="hidden lg:block space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B1221]/50">Processo Prioritário</div>
                                    <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-white"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-3/5 p-12 text-white">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Seu Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={handleChange}
                                            placeholder="Ex: João Silva"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">E-mail</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="joao@exemplo.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">WhatsApp</label>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                required
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                placeholder="(11) 99999-9999"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Cidade</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                required
                                                value={formData.cidade}
                                                onChange={handleChange}
                                                placeholder="Sua cidade"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Estado</label>
                                            <select
                                                name="estado"
                                                required
                                                value={formData.estado}
                                                onChange={handleChange}
                                                className="w-full bg-[#0B1221] border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors appearance-none"
                                            >
                                                <option value="">UF</option>
                                                <option value="SP">SP</option>
                                                <option value="RJ">RJ</option>
                                                <option value="MG">MG</option>
                                                <option value="PR">PR</option>
                                                {/* More states could be added */}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Endereço Completo</label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            required
                                            value={formData.endereco}
                                            onChange={handleChange}
                                            placeholder="Rua, número, bairro..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Senha de Acesso</label>
                                            <input
                                                type="password"
                                                name="senha"
                                                required
                                                value={formData.senha}
                                                onChange={handleChange}
                                                placeholder="Digite sua senha"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#FBC02D]">Chave PIX (Para Recebimento)</label>
                                            <input
                                                type="text"
                                                name="chavePix"
                                                required
                                                value={formData.chavePix}
                                                onChange={handleChange}
                                                placeholder="CPF, E-mail ou Celular"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-[#FBC02D] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-[#FBC02D] hover:bg-[#f9b100] text-[#0B1221] font-black py-5 rounded-xl transition-all flex items-center justify-center gap-3">
                                        FINALIZAR MEU CADASTRO
                                        <Send className="w-5 h-5" />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest leading-relaxed">
                                        Seus dados estão protegidos. <br /> Ao enviar, você concorda com nossos termos de privacidade.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegisterPage;
