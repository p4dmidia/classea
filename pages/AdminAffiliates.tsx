import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
    Calendar,
    ArrowUpDown,
    Download,
    X,
    Loader2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AdminAffiliates: React.FC = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [filterPlan, setFilterPlan] = useState('Todos');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [affiliates, setAffiliates] = useState<any[]>([]);
    const [totalStats, setTotalStats] = useState({ total: 0, pending: 0, newThisMonth: 0 });

    const itemsPerPage = 8;

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Affiliates separately
            const { data: affData, error: affError } = await supabase
                .from('affiliates')
                .select('*')
                .order('created_at', { ascending: false });

            if (affError) throw affError;

            // 2. Fetch User Settings for all relevant user_ids
            const userIds = affData.map(aff => aff.user_id).filter(id => id);
            const { data: settingsData, error: settingsError } = await supabase
                .from('user_settings')
                .select('user_id, total_earnings')
                .in('user_id', userIds);

            if (settingsError) throw settingsError;

            // Create a lookup map for settings
            const settingsMap = new Map();
            settingsData?.forEach(s => settingsMap.set(s.user_id, s));

            const formattedAffs = affData.map(aff => {
                const settings = settingsMap.get(aff.user_id);
                return {
                    id: aff.id,
                    name: aff.full_name || 'Sem Nome',
                    email: aff.email,
                    phone: aff.whatsapp || 'Não informado',
                    plan: aff.position_slot ? `Slot ${aff.position_slot}` : 'Membro',
                    status: aff.is_active ? (aff.is_verified ? 'Ativo' : 'Pendente') : 'Bloqueado',
                    referrals: 0,
                    earnings: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(settings?.total_earnings || 0),
                    joined: new Date(aff.created_at).toLocaleDateString('pt-BR'),
                    raw_status: aff.is_active,
                    raw_verified: aff.is_verified,
                    user_id: aff.user_id,
                    created_at: aff.created_at
                };
            });

            setAffiliates(formattedAffs);

            const now = new Date();
            const startOfMonthValue = new Date(now.getFullYear(), now.getMonth(), 1);

            const newCount = affData.filter(d => d.created_at && new Date(d.created_at) >= startOfMonthValue).length;
            const pendingCount = formattedAffs.filter(a => a.status === 'Pendente').length;

            setTotalStats({
                total: formattedAffs.length,
                pending: pendingCount,
                newThisMonth: newCount
            });

        } catch (error: any) {
            console.error('Error fetching affiliates:', error);
            toast.error('Falha ao carregar lista de afiliados.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('affiliates')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Afiliado ${!currentStatus ? 'ativado' : 'bloqueado'} com sucesso!`);
            fetchAffiliates();
        } catch (error) {
            toast.error('Erro ao atualizar status.');
        }
    };

    const verifyAffiliate = async (id: string) => {
        try {
            const { error } = await supabase
                .from('affiliates')
                .update({ is_verified: true, is_active: true })
                .eq('id', id);

            if (error) throw error;

            toast.success('Afiliado verificado com sucesso!');
            fetchAffiliates();
        } catch (error) {
            toast.error('Erro ao verificar afiliado.');
        }
    };

    const deleteAffiliate = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este afiliado? Esta ação não pode ser desfeita.')) return;

        try {
            const { error } = await supabase
                .from('affiliates')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Afiliado removido com sucesso!');
            fetchAffiliates();
        } catch (error) {
            toast.error('Erro ao remover afiliado. Ele pode ter dados vinculados.');
        }
    };

    const filteredAffiliates = affiliates.filter(aff => {
        const matchesSearch = aff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            aff.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'Todos' || aff.status === filterStatus;
        const matchesPlan = filterPlan === 'Todos' || aff.plan === filterPlan;

        return matchesSearch && matchesStatus && matchesPlan;
    });

    const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);
    const currentData = filteredAffiliates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(5, 8, 15);
            doc.text('CLASSE A - PREMIUM LIFESTYLE', 14, 20);
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text('Relatório de Afiliados', 14, 30);
            doc.setFontSize(10);
            doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 38);

            const tableColumn = ["ID", "Nome", "E-mail", "Plano", "Status", "Ganhos"];
            const tableRows = filteredAffiliates.map(aff => [
                aff.id.substring(0, 8),
                aff.name,
                aff.email,
                aff.plan,
                aff.status,
                aff.earnings
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 45,
                theme: 'grid',
                headStyles: { fillColor: [5, 8, 15], textColor: [251, 192, 45], fontStyle: 'bold' }
            });

            doc.save('Relatorio_Afiliados_ClasseA.pdf');
            setIsExporting(false);
            toast.success('Relatório PDF baixado com sucesso!');
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-emerald-50 text-emerald-600';
            case 'Pendente': return 'bg-amber-50 text-amber-600';
            case 'Bloqueado': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getPlanColor = (plan: string) => {
        if (plan.includes('Slot')) return 'text-blue-600';
        return 'text-slate-600';
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Afiliados</h1>
                        <p className="text-slate-500 font-medium">Visualize, edite e gerencie todos os parceiros da plataforma.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#FBC02D]" />}
                            Exportar PDF
                        </button>
                        <a
                            href="/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all"
                        >
                            <UserPlus className="w-4 h-4 text-[#FBC02D]" />
                            Novo Afiliado
                        </a>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-2xl font-bold transition-all text-sm ${isFiltersOpen ? 'bg-[#FBC02D]/10 border-[#FBC02D] text-[#05080F]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Filter className="w-4 h-4 text-[#FBC02D]" />
                            Filtros Avançados {(filterStatus !== 'Todos' || filterPlan !== 'Todos') && <span className="w-2 h-2 bg-[#FBC02D] rounded-full"></span>}
                        </button>
                    </div>

                    {/* Advanced Filters Dropdown */}
                    {isFiltersOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Status</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option>Todos</option>
                                        <option>Ativo</option>
                                        <option>Pendente</option>
                                        <option>Bloqueado</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Plano</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        value={filterPlan}
                                        onChange={(e) => {
                                            setFilterPlan(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option>Todos</option>
                                        <option>Membro</option>
                                        <option>Slot 1</option>
                                        <option>Slot 2</option>
                                        <option>Slot 3</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Ações</label>
                                    <button
                                        onClick={() => {
                                            setFilterStatus('Todos');
                                            setFilterPlan('Todos');
                                            setSearchTerm('');
                                            setIsFiltersOpen(false);
                                        }}
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl p-3 text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        Limpar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Affiliates Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                                        Afiliado
                                    </th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Plano</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ganhos</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-6 px-8"><div className="h-12 w-full bg-slate-100 rounded-2xl"></div></td>
                                            <td className="py-6 px-4"><div className="h-6 w-16 bg-slate-100 rounded-full"></div></td>
                                            <td className="py-6 px-4"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                                            <td className="py-6 px-4"><div className="h-8 w-24 bg-slate-100 rounded-full mx-auto"></div></td>
                                            <td className="py-6 px-8 text-right"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : currentData.length > 0 ? (
                                    currentData.map((aff) => (
                                        <tr key={aff.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#05080F] flex items-center justify-center font-black text-[#FBC02D]">
                                                        {aff.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#05080F]">{aff.name}</p>
                                                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
                                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                                <Mail className="w-3 h-3 text-[#FBC02D]" /> {aff.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className={`text-sm font-black uppercase tracking-tight ${getPlanColor(aff.plan)}`}>
                                                    {aff.plan}
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 font-black text-emerald-600">{aff.earnings}</td>
                                            <td className="py-6 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(aff.status)}`}>
                                                    {aff.status === 'Ativo' && <CheckCircle className="w-3 h-3" />}
                                                    {aff.status === 'Pendente' && <AlertCircle className="w-3 h-3" />}
                                                    {aff.status === 'Bloqueado' && <XCircle className="w-3 h-3" />}
                                                    {aff.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {aff.status === 'Pendente' && (
                                                        <button
                                                            onClick={() => verifyAffiliate(aff.id)}
                                                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                            title="Verificar"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleStatus(aff.id, aff.raw_status)}
                                                        className={`p-2 rounded-xl transition-all ${aff.raw_status ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                        title={aff.raw_status ? 'Bloquear' : 'Ativar'}
                                                    >
                                                        {aff.raw_status ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAffiliate(aff.id)}
                                                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Excluir"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="font-bold">Nenhum afiliado encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-8 border-t border-slate-50 flex justify-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#05080F] text-white' : 'hover:bg-slate-100 text-[#05080F]'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                    <div className="bg-[#05080F] rounded-[2rem] p-6 text-white flex items-center gap-5 shadow-xl shadow-[#05080F]/10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total de Afiliados</p>
                            <h4 className="text-2xl font-black">{totalStats.total}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Solicitações Pendentes</p>
                            <h4 className="text-2xl font-black text-[#05080F]">{totalStats.pending}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novos este Mês</p>
                            <h4 className="text-2xl font-black text-[#05080F]">+{totalStats.newThisMonth}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAffiliates;
