
import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    Package,
    User,
    Calendar,
    Download,
    ArrowUpRight,
    Truck,
    MapPin,
    Phone,
    X,
    ChevronRight,
    ChevronLeft,
    CreditCard,
    DollarSign,
    ExternalLink
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface Order {
    id: string;
    customer: string;
    date: string;
    product: string;
    total: string;
    status: string;
    payment: string;
    referral: string;
    address?: string;
    email?: string;
    phone?: string;
    items?: Array<{ name: string; price: string; qty: number }>;
}

const AdminOrders: React.FC = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const itemsPerPage = 5;

    const allOrders: Order[] = [
        {
            id: '#ORD-9842',
            customer: 'Cláudio Ferreira',
            date: '21 Fev, 14:20',
            product: 'Colchão Classe A Gold',
            total: 'R$ 4.590',
            status: 'Pago',
            payment: 'Cartão de Crédito',
            referral: 'afiliado123',
            address: 'Av. Paulista, 1000 - São Paulo, SP',
            email: 'claudio@email.com',
            phone: '(11) 98888-7777',
            items: [{ name: 'Colchão Classe A Gold', price: 'R$ 4.590', qty: 1 }]
        },
        {
            id: '#ORD-9841',
            customer: 'Renata Souza',
            date: '21 Fev, 11:05',
            product: 'Acessório Magnético',
            total: 'R$ 290',
            status: 'Pendente',
            payment: 'Pix',
            referral: 'afiliado55',
            address: 'Rua das Flores, 123 - Rio de Janeiro, RJ',
            email: 'renata@email.com',
            phone: '(21) 97777-6666',
            items: [{ name: 'Acessório Magnético', price: 'R$ 290', qty: 1 }]
        },
        {
            id: '#ORD-9840',
            customer: 'Marcos Almeida',
            date: '20 Fev, 18:45',
            product: 'Consórcio Classe A',
            total: 'R$ 890',
            status: 'Enviado',
            payment: 'Boleto',
            referral: 'afiliado123',
            address: 'Rua do Comércio, 456 - Curitiba, PR',
            email: 'marcos@email.com',
            phone: '(41) 96666-5555',
            items: [{ name: 'Consórcio Classe A', price: 'R$ 890', qty: 1 }]
        },
        {
            id: '#ORD-9839',
            customer: 'Juliana Lima',
            date: '20 Fev, 15:30',
            product: 'Colchão Smart Sleep',
            total: 'R$ 3.850',
            status: 'Cancelado',
            payment: 'Cartão de Crédito',
            referral: 'afiliado89',
            address: 'Rua Arvoredo, 789 - Porto Alegre, RS',
            email: 'juliana@email.com',
            phone: '(51) 95555-4444',
            items: [{ name: 'Colchão Smart Sleep', price: 'R$ 3.850', qty: 1 }]
        },
        {
            id: '#ORD-9838',
            customer: 'Roberto Santos',
            date: '20 Fev, 10:15',
            product: 'Pillow Top Visco',
            total: 'R$ 890',
            status: 'Pago',
            payment: 'Pix',
            referral: 'Nenhum',
            address: 'Av. Beira Mar, 321 - Florianópolis, SC',
            email: 'roberto@email.com',
            phone: '(48) 94444-3333',
            items: [{ name: 'Pillow Top Visco', price: 'R$ 890', qty: 1 }]
        },
    ];

    // Filter Logic
    const filteredOrders = allOrders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentData = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pago': return 'bg-emerald-50 text-emerald-600';
            case 'Pendente': return 'bg-amber-50 text-amber-600';
            case 'Enviado': return 'bg-blue-50 text-blue-600';
            case 'Cancelado': return 'bg-red-50 text-red-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleStatusUpdate = (orderId: string, newStatus: string) => {
        handleToast(`Status do pedido ${orderId} atualizado para ${newStatus}`);
        setIsStatusMenuOpen(false);
        setActiveOrderId(null);
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Gestão de Pedidos</h1>
                        <p className="text-slate-500 font-medium">Acompanhe e gerencie todas as vendas realizadas na plataforma.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleToast('Exportando pedidos...')}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all"
                        >
                            <Download className="w-4 h-4 text-[#FBC02D]" />
                            Exportar CSV
                        </button>
                        <button
                            onClick={() => handleToast('Funcionalidade em desenvolvimento')}
                            className="bg-[#05080F] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all"
                        >
                            <PlusIcon className="w-4 h-4 text-[#FBC02D]" />
                            Novo Pedido
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative z-20">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente ou produto..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-[#FBC02D] transition-all"
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
                            Filtros Avançados {filterStatus !== 'Todos' && <span className="w-2 h-2 bg-[#FBC02D] rounded-full"></span>}
                        </button>
                    </div>

                    {/* Filters Dropdown */}
                    {isFiltersOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Status do Pedido</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-[#05080F] outline-none focus:border-[#FBC02D]"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option>Todos</option>
                                        <option>Pago</option>
                                        <option>Pendente</option>
                                        <option>Enviado</option>
                                        <option>Cancelado</option>
                                    </select>
                                </div>
                                <div className="space-y-2 flex flex-col justify-end">
                                    <button
                                        onClick={() => {
                                            setFilterStatus('Todos');
                                            setSearchTerm('');
                                            setIsFiltersOpen(false);
                                            setCurrentPage(1);
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

                {/* Orders Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">ID Pedido</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Cliente</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Produto</th>
                                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Total</th>
                                    <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {currentData.length > 0 ? currentData.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8" onClick={() => handleViewDetails(order)}>
                                            <span className="font-black text-[#05080F] hover:text-[#FBC02D] transition-colors cursor-pointer">{order.id}</span>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{order.date}</p>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                    {order.customer.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#05080F]">{order.customer}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                        <MapPin className="w-3 h-3" /> São Paulo, SP
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-[#FBC02D]" />
                                                <span className="text-sm font-bold text-slate-600">{order.product}</span>
                                            </div>
                                            {order.referral !== 'Nenhum' && (
                                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mt-0.5">Ref: {order.referral}</p>
                                            )}
                                        </td>
                                        <td className="py-6 px-4">
                                            <p className="font-black text-[#05080F]">{order.total}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{order.payment}</p>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {order.status === 'Pago' && <CheckCircle className="w-3 h-3" />}
                                                {order.status === 'Pendente' && <Clock className="w-3 h-3" />}
                                                {order.status === 'Enviado' && <Truck className="w-3 h-3" />}
                                                {order.status === 'Cancelado' && <XCircle className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right relative">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="p-2 text-slate-300 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all"
                                                    title="Ver Detalhes"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => {
                                                            setIsStatusMenuOpen(!isStatusMenuOpen);
                                                            setActiveOrderId(order.id);
                                                        }}
                                                        className={`p-2 rounded-xl transition-all ${isStatusMenuOpen && activeOrderId === order.id ? 'bg-[#05080F] text-white' : 'text-slate-300 hover:text-[#05080F] hover:bg-slate-100'}`}
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>

                                                    {isStatusMenuOpen && activeOrderId === order.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Mudar Status</p>
                                                            {(['Pago', 'Pendente', 'Enviado', 'Cancelado'] as const).map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => handleStatusUpdate(order.id, status)}
                                                                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${order.status === status ? 'text-[#FBC02D] bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-[#05080F]'}`}
                                                                >
                                                                    <div className={`w-2 h-2 rounded-full ${getStatusStyle(status).split(' ')[0]}`}></div>
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p className="font-bold">Nenhum pedido encontrado.</p>
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
                            <p className="text-sm text-slate-400 font-medium">Mostrando {currentData.length} de {filteredOrders.length} pedidos</p>
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

                {/* Dashboard Integration / Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#10B981] rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pedidos de Hoje</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black">24</h4>
                            <ArrowUpRight className="w-6 h-6 opacity-40" />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pagamentos Pendentes</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">08</h4>
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Em Envio</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">15</h4>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mês</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-[#05080F]">482</h4>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsDetailsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-50/50 p-6 md:p-10 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-[#05080F]">{selectedOrder.id}</h2>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Realizado em {selectedOrder.date}</p>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-4 bg-white text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 md:p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Customer Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <User className="w-3 h-3 text-[#FBC02D]" /> Informações do Cliente
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-[#05080F]">
                                                {selectedOrder.customer.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#05080F]">{selectedOrder.customer}</p>
                                                <p className="text-xs font-bold text-slate-400">{selectedOrder.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin className="w-3 h-3 text-slate-400" /> {selectedOrder.address}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <Phone className="w-3 h-3 text-slate-400" /> {selectedOrder.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <ShoppingCart className="w-3 h-3 text-[#FBC02D]" /> Resumo da Compra
                                    </div>
                                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] space-y-4 shadow-sm">
                                        <div className="space-y-3">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-[#05080F]">{item.qty}x</span>
                                                        <span className="font-bold text-slate-600">{item.name}</span>
                                                    </div>
                                                    <span className="font-black text-[#05080F]">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                                <span>Pagamento por {selectedOrder.payment}</span>
                                                <span>Frete Grátis</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="font-black text-[#05080F]">TOTAL</span>
                                                <span className="text-2xl font-black text-[#FBC02D]">{selectedOrder.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Section if applicable */}
                            {selectedOrder.referral !== 'Nenhum' && (
                                <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                            <ExternalLink className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Comissão de Afiliado</p>
                                            <p className="text-sm font-black text-[#05080F]">Indicação de: <span className="text-blue-600">{selectedOrder.referral}</span></p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2 bg-white border border-blue-100 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                        VER AFILIADO
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                            <button className="flex-grow py-4 bg-[#05080F] text-white rounded-2xl font-black text-sm hover:bg-[#1a2436] transition-all flex items-center justify-center gap-2">
                                <Truck className="w-5 h-5 text-[#FBC02D]" />
                                GERAR CÓDIGO DE RASTREIO
                            </button>
                            <button className="flex-grow py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                MARCAR COMO CONCLUÍDO
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#05080F] text-[#FBC02D] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-black text-sm">
                    <CheckCircle className="w-5 h-5 border-2 border-[#FBC02D] rounded-full" />
                    {toastMessage}
                </div>
            )}
        </AdminLayout>
    );
};

// Quick Icons
const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default AdminOrders;
