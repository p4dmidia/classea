
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Wallet,
    TrendingUp,
    ExternalLink
} from 'lucide-react';

interface AffiliateLayoutProps {
    children: React.ReactNode;
}

const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Indicações', icon: Users, path: '/dashboard/referrals' },
        { label: 'Financeiro', icon: Wallet, path: '#' },
        { label: 'Relatórios', icon: TrendingUp, path: '#' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-72 bg-[#0B1221] flex-col p-6 text-white shrink-0">
                <div className="mb-12 px-2">
                    <Link to="/">
                        <img src="/assets/logo.png" alt="Classe A" className="h-12 w-auto brightness-0 invert" />
                    </Link>
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${isActive
                                        ? 'bg-[#FBC02D]/10 text-[#FBC02D]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#FBC02D]' : 'group-hover:text-[#FBC02D]'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Suporte</p>
                    <a href="#" className="text-sm font-medium hover:text-[#FBC02D] transition-colors">Central de Ajuda</a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-10 lg:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AffiliateLayout;
