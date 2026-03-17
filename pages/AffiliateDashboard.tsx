
import React, { useState, useEffect } from 'react';
import {
    Users,
    Wallet,
    TrendingUp,
    Copy,
    CheckCircle,
    ChevronRight,
    ArrowUpRight,
    Clock,
    ExternalLink,
    Award,
    ShoppingCart,
    UserPlus,
    AlertCircle
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const AffiliateDashboard: React.FC = () => {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [affiliateData, setAffiliateData] = useState<any>(null);
    const [walletData, setWalletData] = useState<any>(null);
    const [consortiumStatus, setConsortiumStatus] = useState<any>(null);
    const [activeReferralsCount, setActiveReferralsCount] = useState(0);
    const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                setLoading(true);

                // 1. Buscar dados do Afiliado
                const { data: aff, error: affErr } = await supabase
                    .from('affiliates')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (affErr) throw affErr;
                setAffiliateData(aff);

                const effectiveOrgId = aff.organization_id || profile?.organization_id || '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';

                // 2. Buscar dados Financeiros
                const { data: wallet, error: walletErr } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('organization_id', effectiveOrgId)
                    .single();

                if (walletErr) throw walletErr;
                setWalletData(wallet);

                // 3. Buscar status do Consórcio
                const { data: status, error: statusErr } = await supabase
                    .rpc('check_consortium_regularity', { p_user_id: user.id });

                if (!statusErr && status && status.length > 0) {
                    setConsortiumStatus(status[0]);
                }

                // 4. Buscar indicações ativas (contagem)
                const { count: activeCount } = await supabase
                    .from('affiliates')
                    .select('*', { count: 'exact', head: true })
                    .eq('sponsor_id', aff.id)
                    .eq('organization_id', effectiveOrgId)
                    .eq('is_active', true);
                
                setActiveReferralsCount(activeCount || 0);

                // 5. Buscar últimas indicações
                const { data: recent } = await supabase
                    .from('affiliates')
                    .select('id, full_name, created_at, is_active')
                    .eq('sponsor_id', aff.id)
                    .eq('organization_id', effectiveOrgId)
                    .order('created_at', { ascending: false })
                    .limit(5);
                
                setRecentReferrals(recent || []);

            } catch (err: any) {
                console.error('Erro ao carregar dados do dashboard:', err);
                toast.error('Não foi possível carregar alguns dados.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const userLogin = affiliateData?.referral_code || "...";
    const domain = window.location.origin;
    const affiliateLink = `${domain}/ref/${userLogin.toLowerCase()}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(affiliateLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenStore = () => {
        window.open('/', '_blank');
    };

    const handleSupportWhatsApp = () => {
        const message = encodeURIComponent('Olá, preciso de suporte, pode me ajudar?');
        window.open(`https://wa.me/554199670714?text=${message}`, '_blank');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const stats = [
        {
            label: 'Saldo Disponível',
            value: formatCurrency(walletData?.available_balance || 0),
            icon: Wallet,
            color: 'text-[#FBC02D]'
        },
        {
            label: 'Total Ganhos',
            value: formatCurrency(walletData?.total_earnings || 0),
            icon: TrendingUp,
            color: 'text-emerald-500'
        },
        {
            label: 'Indicações Ativas',
            value: activeReferralsCount.toString(),
            icon: Users,
            color: 'text-blue-500'
        },
        {
            label: 'Taxa de Conversão',
            value: '0.0%', // TODO: Implementar métrica real
            icon: Award,
            color: 'text-purple-500'
        },
    ];

    const recentCommissions: any[] = []; // TODO: Buscar da tabela de comissões quando implementada

    if (loading) {
        return (
            <AffiliateLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FBC02D]"></div>
                </div>
            </AffiliateLayout>
        );
    }

    return (
        <AffiliateLayout>
            {/* Top Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Olá, {affiliateData?.full_name?.split(' ')[0] || 'Afiliado'}!</h1>
                    <p className="text-slate-500 font-medium">Bora ver como estão seus resultados hoje?</p>
                </div>
                <button
                    onClick={handleOpenStore}
                    className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-[#0B1221] shadow-sm hover:shadow-md transition-all"
                >
                    <ExternalLink className="w-4 h-4 text-[#FBC02D]" />
                    Ver Loja Classe A
                </button>
            </header>

            {/* Consortium Warning */}
            {consortiumStatus?.is_member && !consortiumStatus?.is_regular && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className={`p-6 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-6 ${consortiumStatus.status_text === 'Irregular' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${consortiumStatus.status_text === 'Irregular' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black ${consortiumStatus.status_text === 'Irregular' ? 'text-red-900' : 'text-amber-900'}`}>
                                    Atenção: Pagamento do Consórcio {consortiumStatus.status_text}
                                </h3>
                                <p className={`font-medium ${consortiumStatus.status_text === 'Irregular' ? 'text-red-700/70' : 'text-amber-700/70'}`}>
                                    {consortiumStatus.status_text === 'Irregular' 
                                        ? 'Você está fora do prazo de pagamento. Entre em contato com o suporte ou realize sua recompra imediatamente.' 
                                        : `Sua recompra mensal ainda não foi identificada. O prazo vence em ${consortiumStatus.days_to_deadline} dias (dia 10).`}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.location.href = '/consorcio'}
                            className={`px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap shadow-lg ${consortiumStatus.status_text === 'Irregular' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' : 'bg-amber-500 text-[#0B1221] hover:bg-amber-600 shadow-amber-200'}`}
                        >
                            REALIZAR RECOMPRA AGORA
                        </button>
                    </div>
                </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                +8%
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main area - Charts/Links */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Referral Links Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Link Loja */}
                        <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-[#0B1221]/20">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-[#FBC02D]" />
                                    Link para Loja
                                </h2>
                                <p className="text-slate-400 text-xs mb-6">Mande para clientes direto para a vitrine.</p>

                                <div className="space-y-4">
                                    <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between group">
                                        <span className="text-slate-200 text-xs font-medium truncate mr-2">{affiliateLink}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(affiliateLink);
                                            toast.success('Link da Loja copiado!');
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FBC02D] text-[#0B1221] rounded-xl font-black text-xs hover:bg-[#ffc947] transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                        COPIAR LINK LOJA
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBC02D]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        </div>

                        {/* Link Cadastro */}
                        <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-[#0B1221]/20 border border-white/5">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-blue-400" />
                                    Link para Cadastro
                                </h2>
                                <p className="text-slate-400 text-xs mb-6">Mande para novos parceiros se cadastrarem.</p>

                                <div className="space-y-4">
                                    <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between group">
                                        <span className="text-slate-200 text-xs font-medium truncate mr-2">{affiliateLink}?to=register</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${affiliateLink}?to=register`);
                                            toast.success('Link de Cadastro copiado!');
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-black text-xs hover:bg-blue-600 transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                        COPIAR LINK CADASTRO
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        </div>
                    </div>

                    {/* Commissions Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#0B1221]">Últimas Indicações</h3>
                            <button className="text-[#FBC02D] font-bold text-sm hover:underline flex items-center gap-1">
                                Ver tudo <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Data</th>
                                        <th className="text-left py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Comissão</th>
                                        <th className="text-right py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentReferrals.length > 0 ? (
                                        recentReferrals.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0B1221] font-bold text-xs uppercase">
                                                            {(item.full_name || 'A').split(' ').map((n: any) => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <span className="font-bold text-[#0B1221]">{item.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-2 text-sm text-slate-500 font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-2 font-black text-[#0B1221]">Afiliado</td>
                                                <td className="py-5 px-2 text-right">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {item.is_active ? 'Ativo' : 'Pendente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-10 text-center text-slate-400 font-medium">
                                                Nenhuma indicação recente encontrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area - Profile/Help */}
                <div className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg mx-auto overflow-hidden flex items-center justify-center">
                                {affiliateData?.full_name ? (
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${affiliateData.full_name}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <h3 className="text-xl font-black text-[#0B1221]">{affiliateData?.full_name || 'Afiliado'}</h3>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Afiliado Classe A</p>

                        <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-50 pt-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranking</p>
                                <p className="font-black text-[#0B1221]">#12</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível</p>
                                <p className="font-black text-[#0B1221]">Lv. 5</p>
                            </div>
                        </div>

                        <button className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                            Editar Perfil
                        </button>
                    </div>

                    {/* Support/Resource Box */}
                    <div className="bg-gradient-to-br from-[#FBC02D] to-[#ffa000] rounded-[2.5rem] p-8 text-[#0B1221]">
                        <h3 className="text-xl font-black mb-2">Precisa de ajuda?</h3>
                        <p className="text-[#0B1221]/70 text-sm font-medium mb-6">Nossa equipe está pronta para te ajudar a vender mais.</p>
                        <button
                            onClick={handleSupportWhatsApp}
                            className="w-full bg-white/20 hover:bg-white/30 py-4 rounded-2xl font-black transition-all border border-white/20 backdrop-blur-sm"
                        >
                            CHAMAR SUPORTE
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateDashboard;
