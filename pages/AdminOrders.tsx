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
    ArrowLeft,
    ArrowRight,
    CreditCard,
    DollarSign,
    ExternalLink,
    Loader2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    total_amount: number;
    status: string;
    payment_method: string;
    referral_code: string;
    tracking_code?: string;
    created_at: string;
    order_items?: OrderItem[];
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
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState({
        today: 0,
        pending: 0,
        shipping: 0,
        monthTotal: 0
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const itemsPerPage = 8;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            // 0. Fetch Classe A Organization ID
            const { data: orgData } = await supabase
                .from('organizations')
                .select('id')
                .eq('name', 'Classe A')
                .single();
            
            const effectiveOrgId = orgData?.id || '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('organization_id', effectiveOrgId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Erro ao carregar pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (allOrders: Order[]) => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const today = allOrders.filter(o => o.created_at.startsWith(todayStr)).length;
        const pending = allOrders.filter(o => o.status === 'Pendente').length;
        const shipping = allOrders.filter(o => o.status === 'Enviado').length;
        const monthTotal = allOrders.filter(o => new Date(o.created_at) >= monthStart).length;

        setStats({ today, pending, shipping, monthTotal });
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        console.log(`Updating order ${orderId} to status ${newStatus}`);
        
        try {
            const { error } = await supabase
                .from('orders')
                .update({ 
                    status: newStatus, 
                    updated_at: new Date().toISOString() 
                })
                .eq('id', orderId);

            if (error) {
                console.error('Supabase update error:', error);
                throw error;
            }

            toast.success(`Status do pedido atualizado para ${newStatus}`);
            
            // Update local orders list
            const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
            setOrders(updatedOrders);
            
            // Update selected order if it's the one being modified
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            setIsStatusMenuOpen(false);
            setActiveOrderId(null);

            // Update stats
            calculateStats(updatedOrders);
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error(error.message || 'Erro ao atualizar status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleExportCSV = () => {
        if (orders.length === 0) {
            toast.error('Nenhum pedido para exportar');
            return;
        }

        const headers = ['ID', 'Cliente', 'Email', 'Total', 'Status', 'Data'];
        const csvContent = [
            headers.join(','),
            ...orders.map(o => [
                o.id,
                o.customer_name,
                o.customer_email,
                o.total_amount,
                o.status,
                new Date(o.created_at).toLocaleDateString('pt-BR')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pedidos_classe_a_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Pedidos exportados com sucesso!');
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.order_items && order.order_items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentData = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
                            onClick={handleExportCSV}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all"
                        >
                            <Download className="w-4 h-4 text-[#FBC02D]" />
                            Exportar CSV
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-[#10B981] rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pedidos de Hoje</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl md:text-3xl font-black">{stats.today}</h4>
                            <ArrowUpRight className="w-6 h-6 opacity-40" />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pagamentos Pendentes</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl md:text-3xl font-black text-[#05080F]">{stats.pending.toString().padStart(2, '0')}</h4>
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Em Envio</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl md:text-3xl font-black text-[#05080F]">{stats.shipping.toString().padStart(2, '0')}</h4>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Mês</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl md:text-3xl font-black text-[#05080F]">{stats.monthTotal}</h4>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative z-20">
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
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-200 z-30">
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

                {/* Orders List (Responsive) */}
                <div className="space-y-4 shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="text-left py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">ID Pedido</th>
                                        <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Cliente</th>
                                        <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Produto Principal</th>
                                        <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Total</th>
                                        <th className="text-center py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                        <th className="text-right py-6 px-8 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="py-6 px-8"><div className="h-10 w-24 bg-slate-100 rounded-lg"></div></td>
                                                <td className="py-6 px-4"><div className="h-10 w-40 bg-slate-100 rounded-lg"></div></td>
                                                <td className="py-6 px-4"><div className="h-10 w-48 bg-slate-100 rounded-lg"></div></td>
                                                <td className="py-6 px-4"><div className="h-10 w-24 bg-slate-100 rounded-lg"></div></td>
                                                <td className="py-6 px-4"><div className="h-8 w-24 bg-slate-100 rounded-full mx-auto"></div></td>
                                                <td className="py-6 px-8"><div className="h-10 w-24 bg-slate-100 rounded-xl ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : currentData.length > 0 ? (
                                        currentData.map((order) => (
                                            <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-6 px-8" onClick={() => handleViewDetails(order)}>
                                                    <span className="font-black text-[#05080F] hover:text-[#FBC02D] transition-colors cursor-pointer">{order.id}</span>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                        {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                            {order.customer_name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <div className="max-w-[150px]">
                                                            <p className="font-bold text-[#05080F] truncate">{order.customer_name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider truncate">
                                                                <MapPin className="w-3 h-3" /> {order.shipping_address?.split('-')[0] || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-[#FBC02D]" />
                                                        <span className="text-sm font-bold text-slate-600 truncate max-w-[200px]">
                                                            {order.order_items?.[0]?.product_name || 'Sem produtos'}
                                                            {order.order_items && order.order_items.length > 1 && ` (+${order.order_items.length - 1})`}
                                                        </span>
                                                    </div>
                                                    {order.referral_code && (
                                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mt-0.5">Ref: {order.referral_code}</p>
                                                    )}
                                                </td>
                                                <td className="py-6 px-4">
                                                    <p className="font-black text-[#05080F]">{formatCurrency(order.total_amount)}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{order.payment_method}</p>
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
                                                                    setIsStatusMenuOpen(!isStatusMenuOpen || activeOrderId !== order.id);
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
                                                                            disabled={isUpdating}
                                                                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${order.status === status ? 'text-[#FBC02D] bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-[#05080F]'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        >
                                                                            <div className={`w-2 h-2 rounded-full ${getStatusStyle(status).split(' ')[0]}`}></div>
                                                                            {isUpdating && activeOrderId === order.id ? '...' : status}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
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
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 animate-pulse space-y-4">
                                    <div className="h-6 w-24 bg-slate-100 rounded-lg"></div>
                                    <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                                    <div className="h-4 w-3/4 bg-slate-100 rounded-lg"></div>
                                </div>
                            ))
                        ) : currentData.length > 0 ? (
                            currentData.map((order) => (
                                <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 relative">
                                    <div className="flex justify-between items-start">
                                        <div onClick={() => handleViewDetails(order)} className="cursor-pointer">
                                            <span className="font-black text-[#05080F] text-lg hover:text-[#FBC02D] transition-colors">{order.id}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 py-3 border-y border-slate-50">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                            {order.customer_name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#05080F] text-sm">{order.customer_name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" /> {order.shipping_address?.split('-')[0] || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-black text-[#05080F]">{formatCurrency(order.total_amount)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-[#05080F] hover:bg-slate-100 rounded-xl transition-all"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsStatusMenuOpen(!isStatusMenuOpen || activeOrderId !== order.id);
                                                    setActiveOrderId(order.id);
                                                }}
                                                className={`p-3 rounded-xl transition-all ${isStatusMenuOpen && activeOrderId === order.id ? 'bg-[#05080F] text-white' : 'bg-slate-50 text-slate-400 hover:text-[#05080F] hover:bg-slate-100'}`}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {isStatusMenuOpen && activeOrderId === order.id && (
                                        <div className="absolute right-6 bottom-20 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Mudar Status</p>
                                            {(['Pago', 'Pendente', 'Enviado', 'Cancelado'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(order.id, status)}
                                                    disabled={isUpdating}
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${order.status === status ? 'text-[#FBC02D] bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-[#05080F]'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${getStatusStyle(status).split(' ')[0]}`}></div>
                                                    {isUpdating && activeOrderId === order.id ? '...' : status}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
                                <Search className="w-12 h-12 opacity-20 mx-auto" />
                                <p className="font-bold text-slate-400 mt-3">Nenhum pedido encontrado.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-400 font-medium order-2 sm:order-1">Mostrando {currentData.length} de {filteredOrders.length} pedidos</p>
                            <div className="flex gap-2 order-1 sm:order-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#05080F] text-white shadow-lg shadow-[#05080F]/10' : 'bg-white border border-slate-100 hover:bg-slate-50 text-[#05080F]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-slate-200 rounded-xl text-[#05080F] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
                    <div className="absolute inset-0 bg-[#05080F]/80 backdrop-blur-sm" onClick={() => setIsDetailsModalOpen(false)}></div>
                    <div className="bg-white w-full h-full md:h-auto md:max-w-3xl md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                        <div className="bg-slate-50/50 p-6 md:p-10 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl md:text-3xl font-black text-[#05080F] truncate">{selectedOrder.id}</h2>
                                    <span className={`px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shrink-0 ${getStatusStyle(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-slate-400 font-bold mt-1 uppercase text-[8px] md:text-xs tracking-widest">
                                    {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-3 md:p-4 bg-white text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0">
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        <div className="p-6 md:p-10 overflow-y-auto flex-grow custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                {/* Customer Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <User className="w-3 h-3 text-[#FBC02D]" /> Informações do Cliente
                                    </div>
                                    <div className="bg-slate-50 p-5 md:p-6 rounded-[2rem] space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-[#05080F]">
                                                {selectedOrder.customer_name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-[#05080F] text-sm md:text-base truncate">{selectedOrder.customer_name}</p>
                                                <p className="text-[10px] md:text-xs font-bold text-slate-400 truncate">{selectedOrder.customer_email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
                                            <div className="flex items-start gap-2 text-[10px] md:text-xs font-bold text-slate-600">
                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" /> <span className="flex-1">{selectedOrder.shipping_address || 'Endereço não informado'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-600">
                                                <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {selectedOrder.customer_phone || 'Telefone não informado'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <ShoppingCart className="w-3 h-3 text-[#FBC02D]" /> Resumo da Compra
                                    </div>
                                    <div className="bg-white border border-slate-100 p-5 md:p-6 rounded-[2rem] space-y-4 shadow-sm">
                                        <div className="space-y-3">
                                            {selectedOrder.order_items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-[10px] md:text-sm">
                                                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                                        <span className="font-black text-[#05080F] shrink-0">{item.quantity}x</span>
                                                        <span className="font-bold text-slate-600 truncate">{item.product_name}</span>
                                                    </div>
                                                    <span className="font-black text-[#05080F] shrink-0">{formatCurrency(item.unit_price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 space-y-2">
                                            <div className="flex justify-between text-[8px] md:text-xs font-bold text-slate-400">
                                                <span>Pagamento: {selectedOrder.payment_method}</span>
                                                <span>Frete Grátis</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="font-black text-[#05080F] text-xs">TOTAL</span>
                                                <span className="text-xl md:text-2xl font-black text-[#FBC02D]">{formatCurrency(selectedOrder.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4 shrink-0">
                            <button
                                onClick={() => handleStatusUpdate(selectedOrder.id, 'Enviado')}
                                disabled={isUpdating}
                                className={`w-full md:flex-grow py-3 md:py-4 bg-[#05080F] text-white rounded-2xl font-black text-xs md:text-sm hover:bg-[#1a2436] transition-all flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4 md:w-5 md:h-5 text-[#FBC02D]" />}
                                {isUpdating ? 'PROCESSANDO...' : 'MARCAR COMO ENVIADO'}
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedOrder.id, 'Pago')}
                                disabled={isUpdating}
                                className={`w-full md:flex-grow py-3 md:py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs md:text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                                {isUpdating ? 'PROCESSANDO...' : 'CONFIRMAR PAGAMENTO'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
