
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    ShieldAlert,
    LogOut,
    Bell,
    Search,
    ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { label: 'Visão Geral', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Afiliados', icon: Users, path: '/admin/affiliates' },
        { label: 'Produtos', icon: Package, path: '/admin/products' },
        { label: 'Pedidos', icon: ShoppingCart, path: '/admin/orders' },
        { label: 'Segurança', icon: ShieldAlert, path: '#' },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#05080F] flex flex-col p-6 text-white shrink-0 fixed h-full">
                <div className="mb-12 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FBC02D] rounded-xl flex items-center justify-center">
                        <ShieldAlert className="w-6 h-6 text-[#05080F]" />
                    </div>
                    <span className="text-xl font-black tracking-tight uppercase">Admin Panel</span>
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${isActive
                                    ? 'bg-[#FBC02D] text-[#05080F]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-400/10 transition-all w-full">
                        <LogOut className="w-5 h-5" />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow ml-72">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por pedidos, afiliados..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-[#05080F] transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-[#05080F]">Administrador</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
