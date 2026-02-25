
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

// No need for separate interface if using standalone autoTable function

const AdminAffiliates: React.FC = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [filterPlan, setFilterPlan] = useState('Todos');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const itemsPerPage = 5;

    const allAffiliates = [
        { id: 1, name: 'Ricardo Santos', email: 'ricardo@email.com', phone: '(11) 98765-4321', plan: 'Diamante', status: 'Ativo', referrals: 158, earnings: 'R$ 12.450', joined: '15 Jan 2024' },
        { id: 2, name: 'Letícia Barros', email: 'leticia@email.com', phone: '(21) 97654-3210', plan: 'Ouro', status: 'Pendente', referrals: 42, earnings: 'R$ 4.250', joined: '02 Fev 2024' },
        { id: 3, name: 'Marcos Oliveira', email: 'marcos@email.com', phone: '(31) 96543-2109', plan: 'Prata', status: 'Ativo', referrals: 85, earnings: 'R$ 6.800', joined: '20 Dez 2023' },
        { id: 4, name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(41) 95432-1098', plan: 'Bronze', status: 'Bloqueado', referrals: 12, earnings: 'R$ 850', joined: '10 Jan 2024' },
        { id: 5, name: 'Paulo Silva', email: 'paulo@email.com', phone: '(51) 94321-0987', plan: 'Diamante', status: 'Ativo', referrals: 210, earnings: 'R$ 18.200', joined: '05 Nov 2023' },
        { id: 6, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 91234-5678', plan: 'Ouro', status: 'Ativo', referrals: 65, earnings: 'R$ 5.900', joined: '12 Dez 2023' },
        { id: 7, name: 'Bruno Mendes', email: 'bruno@email.com', phone: '(21) 92345-6789', plan: 'Prata', status: 'Pendente', referrals: 15, earnings: 'R$ 1.200', joined: '05 Jan 2024' },
        { id: 8, name: 'Carla Dias', email: 'carla@email.com', phone: '(31) 93456-7890', plan: 'Diamante', status: 'Ativo', referrals: 312, earnings: 'R$ 24.500', joined: '20 Out 2023' },
    ];

    // Filter Logic
    const filteredAffiliates = allAffiliates.filter(aff => {
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

            // PDF Header
            doc.setFontSize(22);
            doc.setTextColor(5, 8, 15); // #05080F
            doc.text('CLASSE A - PREMIUM LIFESTYLE', 14, 20);

            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text('Relatório de Afiliados', 14, 30);

            doc.setFontSize(10);
            doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 38);

            // Search criteria if any
            let yPos = 46;
            if (searchTerm || filterStatus !== 'Todos' || filterPlan !== 'Todos') {
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                let filterStr = 'Filtros aplicados: ';
                if (searchTerm) filterStr += `Busca: "${searchTerm}" | `;
                if (filterStatus !== 'Todos') filterStr += `Status: ${filterStatus} | `;
                if (filterPlan !== 'Todos') filterStr += `Plano: ${filterPlan}`;
                doc.text(filterStr, 14, yPos);
                yPos += 8;
            }

            // Table
            const tableColumn = ["ID", "Nome", "E-mail", "Plano", "Status", "Ganhos", "Indicações"];
            const tableRows = filteredAffiliates.map(aff => [
                aff.id,
                aff.name,
                aff.email,
                aff.plan,
                aff.status,
                aff.earnings,
                aff.referrals
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: yPos,
                theme: 'grid',
                headStyles: { fillColor: [5, 8, 15], textColor: [251, 192, 45], fontStyle: 'bold' }, // #05080F and #FBC02D
                alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
                margin: { top: yPos },
                styles: { fontSize: 9, cellPadding: 4 }
            });

            doc.save('Relatorio_Afiliados_ClasseA.pdf');

            setIsExporting(false);
            setToastMessage('Relatório PDF baixado com sucesso!');
            setShowToast(true);
        }, 1500);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ativo': return 'bg-emerald-50 text-emerald-600';
            case 'Pendente': return 'bg-amber-50 text-amber-600';
            case 'Bloqueado': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'Diamante': return 'text-blue-600';
            case 'Ouro': return 'text-amber-500';
            case 'Prata': return 'text-slate-400';
            case 'Bronze': return 'text-orange-600';
            default: return 'text-slate-600';
        }
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
                                        <option>Diamante</option>
                                        <option>Ouro</option>
                                        <option>Prata</option>
                                        <option>Bronze</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Ações de Filtro</label>
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
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-[#05080F] transition-colors">
                                            Afiliado <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Plano</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Indicações</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ganhos Totais</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentData.length > 0 ? currentData.map((aff) => (
                                    <tr key={aff.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#05080F] overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aff.name}`} alt={aff.name} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#05080F]">{aff.name}</p>
                                                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                            <Mail className="w-3 h-3 text-[#FBC02D]" /> {aff.email}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                            <Phone className="w-3 h-3 text-[#FBC02D]" /> {aff.phone}
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
                                        <td className="py-6 px-4 font-bold text-[#05080F]">{aff.referrals}</td>
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
                                            <button className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="font-bold">Nenhum afiliado encontrado com estes filtros.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-400 font-medium">
                                Mostrando {currentData.length} de {filteredAffiliates.length} afiliados
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    Anterior
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#05080F] text-white shadow-lg shadow-[#05080F]/10' : 'hover:bg-slate-100 text-[#05080F]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#05080F] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    Próximo
                                </button>
                            </div>
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
                            <h4 className="text-2xl font-black">{allAffiliates.length}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Solicitações Pendentes</p>
                            <h4 className="text-2xl font-black text-[#05080F]">12</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5 shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Novos este Mês</p>
                            <h4 className="text-2xl font-black text-[#05080F]">+248</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#05080F] text-[#FBC02D] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-black text-sm">
                    <CheckCircle className="w-5 h-5 border-2 border-[#FBC02D] rounded-full" />
                    {toastMessage}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminAffiliates;
