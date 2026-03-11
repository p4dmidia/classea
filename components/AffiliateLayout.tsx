import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Wallet,
    TrendingUp,
    ExternalLink,
    Library,
    LogOut,
    Star,
    Menu,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface AffiliateLayoutProps {
    children: React.ReactNode;
}

const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Sessão encerrada com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao sair do sistema.');
        }
    };

    const [isConsortiumMember, setIsConsortiumMember] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            checkConsortiumMembership();
        }
    }, [user]);

    const checkConsortiumMembership = async () => {
        try {
            const { data, error } = await supabase.rpc('is_consortium_member', { user_uuid: user?.id });
            if (!error) setIsConsortiumMember(data);
        } catch (error) {
            console.error('Error checking consortium:', error);
        }
    };

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Indicações', icon: Users, path: '/dashboard/referrals' },
        { label: 'Financeiro', icon: Wallet, path: '/dashboard/financial' },
        { label: 'Relatórios', icon: TrendingUp, path: '/dashboard/reports' },
        ...(isConsortiumMember ? [{ label: 'Consórcio', icon: Star, path: '/dashboard/consorcio' }] : []),
        { label: 'Materiais', icon: Library, path: '/dashboard/materials' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 bg-[#0B1221] px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                    <img src="/assets/logo.png" alt="Classe A" className="h-8 w-auto brightness-0 invert" />
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-white hover:text-[#FBC02D] transition-colors"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0B1221]/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 bg-[#0B1221] flex flex-col p-6 text-white shrink-0 fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="mb-12 px-2 flex items-center justify-between">
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
                                onClick={() => setIsSidebarOpen(false)}
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

                <div className="mt-auto space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Usuário</p>
                        <p className="text-sm font-medium truncate mb-4">{user?.email}</p>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            SAIR DO SISTEMA
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AffiliateLayout;
