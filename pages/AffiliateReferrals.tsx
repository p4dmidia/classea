
import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

interface Referral {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    is_active: boolean;
    // Adicionamos campos para bater com o mock UI
    status: string;
    commission?: string;
    product?: string;
}

const AffiliateReferrals: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [affiliateId, setAffiliateId] = useState<string | null>(null);

    // Estados para estatísticas
    const [stats, setStats] = useState([
        { label: 'Total de Indicações', value: '0', icon: Users, color: 'text-blue-500', key: 'total' },
        { label: 'Ativos', value: '0', icon: CheckCircle, color: 'text-emerald-500', key: 'active' },
        { label: 'Inativos', value: '0', icon: XCircle, color: 'text-red-500', key: 'inactive' },
        { label: 'Hoje', value: '0', icon: Clock, color: 'text-amber-500', key: 'today' },
    ]);

    useEffect(() => {
        if (user) {
            fetchReferrals();
        }
    }, [user]);

    const fetchReferrals = async () => {
        try {
            setLoading(true);

            // 1. Pegar o ID de afiliado do usuário logado
            const { data: affData, error: affError } = await supabase
                .from('affiliates')
                .select('id')
                .eq('user_id', user?.id)
                .single();

            if (affError) throw affError;
            setAffiliateId(affData.id);

            // 2. Buscar indicações (downline)
            const { data, error } = await supabase
                .from('affiliates')
                .select('*')
                .eq('sponsor_id', affData.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Mapear para o formato da UI
            const formattedReferrals = (data || []).map(ref => ({
                ...ref,
                status: ref.is_active ? 'Ativo' : 'Inativo',
                product: 'Nível Afiliado', // Como são registros de rede
                commission: 'R$ 0,00' // Pode ser implementado com o sistema de ganhos por nível
            }));

            setReferrals(formattedReferrals);

            // 3. Calcular Estatísticas
            const activeCount = formattedReferrals.filter(r => r.is_active).length;
            const inactiveCount = formattedReferrals.length - activeCount;
            const today = new Date().toISOString().split('T')[0];
            const todayCount = formattedReferrals.filter(r => r.created_at.startsWith(today)).length;

            setStats([
                { label: 'Total de Indicações', value: formattedReferrals.length.toString(), icon: Users, color: 'text-blue-500', key: 'total' },
                { label: 'Ativos', value: activeCount.toString(), icon: CheckCircle, color: 'text-emerald-500', key: 'active' },
                { label: 'Inativos', value: inactiveCount.toString(), icon: XCircle, color: 'text-red-500', key: 'inactive' },
                { label: 'Hoje', value: todayCount.toString(), icon: Clock, color: 'text-amber-500', key: 'today' },
            ]);

        } catch (error: any) {
            console.error('Erro ao buscar indicações:', error);
            toast.error('Erro ao carregar dados das indicações.');
        } finally {
            setLoading(false);
        }
    };

    const filteredReferrals = referrals.filter(ref => {
        const matchesSearch = ref.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ref.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || ref.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleExportCSV = () => {
        if (filteredReferrals.length === 0) {
            toast.error('Não há dados para exportar.');
            return;
        }

        const headers = ['Nome', 'E-mail', 'Data', 'Status'];
        const rows = filteredReferrals.map(ref => [
            ref.full_name,
            ref.email,
            new Date(ref.created_at).toLocaleDateString('pt-BR'),
            ref.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `indicacoes_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Arquivo CSV exportado com sucesso!');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <AffiliateLayout>
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B1221]">Minhas Indicações</h1>
                    <p className="text-slate-500 font-medium">Acompanhe sua rede de afiliados e indicações diretas.</p>
                </div>
                <button
                    onClick={fetchReferrals}
                    className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-[#FBC02D] transition-all"
                >
                    <Clock className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#0B1221] mt-1">
                            {loading ? <span className="animate-pulse">...</span> : stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Table/Filters Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters Bar */}
                <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#FBC02D] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <select
                            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-600 outline-none focus:border-[#FBC02D] text-sm appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="Todos">Todos os Status</option>
                            <option value="Ativo">Ativos</option>
                            <option value="Inativo">Inativos</option>
                        </select>

                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-[#0B1221] rounded-2xl font-bold text-white hover:bg-[#1a2436] transition-all text-sm shadow-lg shadow-blue-900/10"
                        >
                            <Download className="w-4 h-4 text-[#FBC02D]" />
                            CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FBC02D]"></div>
                            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando indicações...</p>
                        </div>
                    ) : filteredReferrals.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        Afiliado Indicado
                                    </th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Produto / Nível</th>
                                    <th className="text-left py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data Cadastro</th>
                                    <th className="text-center py-5 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-right py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredReferrals.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#0B1221] text-[#FBC02D] flex items-center justify-center font-black text-xs">
                                                    {item.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0B1221]">{item.full_name}</span>
                                                    <span className="text-[10px] text-slate-400">{item.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-sm font-medium text-slate-600">{item.product}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1221]">{formatDate(item.created_at).day}</span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase">{formatDate(item.created_at).time}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {item.status === 'Ativo' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button className="text-[#0B1221] hover:text-[#FBC02D] transition-all">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center">
                            <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Nenhuma indicação encontrada.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-sm text-slate-400 font-medium">
                        Mostrando {filteredReferrals.length} de {referrals.length} indicações
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 border border-slate-200 rounded-xl text-slate-300 cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 border border-slate-200 rounded-xl text-slate-300 cursor-not-allowed">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateReferrals;
