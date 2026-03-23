
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
import { useNavigate } from 'react-router-dom';
import AffiliateLayout from '../components/AffiliateLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const AffiliateDashboard: React.FC = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [affiliateData, setAffiliateData] = useState<any>(null);
    const [walletData, setWalletData] = useState<any>(null);
    const [consortiumStatus, setConsortiumStatus] = useState<any>(null);
    const [activeReferralsCount, setActiveReferralsCount] = useState(0);
    const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
    const [recentCommissions, setRecentCommissions] = useState<any[]>([]);
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

                if (affErr) {
                    console.error('DEBUG: Erro ao buscar dados do afiliado:', affErr);
                    throw affErr;
                }
                
                setAffiliateData(aff);
                
                const effectiveOrgId = aff.organization_id || profile?.organization_id || '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';

                // 2. Buscar dados Financeiros
                let { data: wallet, error: walletErr } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('organization_id', effectiveOrgId)
                    .maybeSingle();

                if (walletErr || !wallet) {
                    const { data: retryWallet, error: retryErr } = await supabase
                        .from('user_settings')
                        .select('*')
                        .eq('user_id', user.id)
                        .maybeSingle();
                    
                    if (!retryErr) wallet = retryWallet;
                }
                
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

                // 6. Buscar comissões recentes
                const { data: comms } = await supabase
                    .from('commissions')
                    .select(`
                        id,
                        amount,
                        level,
                        created_at,
                        description
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);
                
                setRecentCommissions(comms || []);

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
        toast.success('Link copiado!');
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
            value: '0.0%',
            icon: Award,
            color: 'text-purple-500'
        },
    ];

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
                <div className="lg:col-span-2 space-y-8">
                    {/* Referral Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-[#FBC02D]" />
                                Link da Loja
                            </h2>
                            <p className="text-slate-400 text-xs mb-6">Compartilhe e ganhe comissões.</p>
                            <div className="flex flex-col gap-4">
                                <div className="bg-white/10 rounded-xl p-3 text-slate-200 text-xs truncate">
                                    {affiliateLink}
                                </div>
                                <button
                                    onClick={handleCopyLink}
                                    className="bg-[#FBC02D] text-[#0B1221] py-3 rounded-xl font-black text-xs hover:bg-[#ffc947] transition-all"
                                >
                                    COPIAR LINK
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0B1221] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-blue-400" />
                                Novo Parceiro
                            </h2>
                            <p className="text-slate-400 text-xs mb-6">Indique novos afiliados para sua rede.</p>
                            <div className="flex flex-col gap-4">
                                <div className="bg-white/10 rounded-xl p-3 text-slate-200 text-xs truncate">
                                    {affiliateLink}?to=register
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${affiliateLink}?to=register`);
                                        toast.success('Link de parceiro copiado!');
                                    }}
                                    className="bg-blue-500 text-white py-3 rounded-xl font-black text-xs hover:bg-blue-600 transition-all"
                                >
                                    COPIAR LINK
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Commissions Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#0B1221]">Comissões Recentes</h3>
                            <button onClick={() => navigate('/financial')} className="text-[#FBC02D] font-bold text-sm hover:underline flex items-center gap-1">
                                Ver extrato <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50 text-left">
                                        <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                                        <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nível</th>
                                        <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentCommissions.length > 0 ? (
                                        recentCommissions.map((comm) => (
                                            <tr key={comm.id}>
                                                <td className="py-4">
                                                    <div className="font-bold text-[#0B1221]">{comm.description}</div>
                                                    <div className="text-[10px] text-slate-400">{new Date(comm.created_at).toLocaleString('pt-BR')}</div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-black text-[10px]">
                                                        NÍVEL {comm.level}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right font-black text-emerald-500">
                                                    {formatCurrency(comm.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-slate-400">
                                                Nenhuma comissão registrada ainda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${affiliateData?.full_name || 'A'}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-black text-[#0B1221]">{affiliateData?.full_name || 'Afiliado'}</h3>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center gap-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase">Rede</p>
                                <p className="font-black text-[#0B1221]">{activeReferralsCount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase">Ganhos</p>
                                <p className="font-black text-emerald-500">{formatCurrency(walletData?.total_earnings || 0)}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/network')}
                            className="w-full mt-8 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl font-bold transition-all"
                        >
                            Ver Minha Rede
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#FBC02D] to-[#ffa000] rounded-[2.5rem] p-8 text-[#0B1221]">
                        <h3 className="text-xl font-black mb-2">Suporte</h3>
                        <p className="text-[#0B1221]/70 text-sm mb-6">Precisa de ajuda com suas vendas?</p>
                        <button onClick={handleSupportWhatsApp} className="w-full bg-white/20 hover:bg-white/30 py-4 rounded-xl font-black transition-all border border-white/20">
                            FALAR NO WHATSAPP
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateDashboard;
