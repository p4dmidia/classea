
import React from 'react';
import {
    ShieldCheck,
    Lock,
    Key,
    Smartphone,
    Globe,
    Monitor,
    Activity,
    AlertTriangle,
    ShieldAlert,
    UserCheck,
    History,
    LogOut,
    ExternalLink,
    ChevronRight,
    Search
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminSecurity: React.FC = () => {
    const accessLogs = [
        {
            id: 1,
            user: 'master_admin',
            ip: '189.45.122.10',
            location: 'São Paulo, BR',
            device: 'Windows / Chrome',
            status: 'Sucesso',
            time: 'Agora mesmo'
        },
        {
            id: 2,
            user: 'master_admin',
            ip: '189.45.122.10',
            location: 'São Paulo, BR',
            device: 'Mobile / Safari',
            status: 'Sucesso',
            time: '2 horas atrás'
        },
        {
            id: 3,
            user: 'unknown',
            ip: '45.12.88.231',
            location: 'Kiev, UA',
            device: 'Linux / Firefox',
            status: 'Falha no Login',
            time: '5 horas atrás'
        },
        {
            id: 4,
            user: 'support_admin',
            ip: '201.8.44.156',
            location: 'Rio de Janeiro, BR',
            device: 'MacBook / Chrome',
            status: 'Sucesso',
            time: 'Ontem, 16:40'
        },
    ];

    const admins = [
        { name: 'Master Admin', role: 'Super Usuário', status: 'Ativo', lastLogin: 'Hoje' },
        { name: 'Suporte Técnico', role: 'Moderador', status: 'Ativo', lastLogin: 'Ontem' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Segurança do Sistema</h1>
                        <p className="text-slate-500 font-medium">Monitore acessos, gerencie privilégios e configure camadas de proteção.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                            <ShieldCheck className="w-4 h-4" />
                            Auditoria Completa
                        </button>
                    </div>
                </div>

                {/* Security Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#05080F]">Score de Segurança</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Proteção Ativa</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-[#05080F]">98%</span>
                            <span className="text-emerald-500 font-bold text-sm mb-1">+2% vs mês anterior</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Lock className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-[#05080F]">Sessões Ativas</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monitoramento</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-[#05080F]">12</span>
                            <span className="text-blue-500 font-bold text-sm mb-1">Dispositivos logados</span>
                        </div>
                    </div>

                    <div className="bg-red-500 rounded-[2rem] p-6 text-white shadow-xl shadow-red-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-black">
                                !
                            </div>
                            <div>
                                <h4 className="font-black text-white">Alertas Críticos</h4>
                                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Ações Necessárias</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black">01</span>
                            <span className="text-white/80 font-bold text-sm mb-1">Tentativa de brute-force</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Access Logs */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-[#05080F]">Logs de Acesso</h3>
                                <p className="text-sm font-medium text-slate-400">Últimas atividades administrativas na plataforma.</p>
                            </div>
                            <button className="text-slate-400 hover:text-[#05080F] transition-colors">
                                <History className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Usuário</th>
                                        <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">IP / Localização</th>
                                        <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Dispositivo</th>
                                        <th className="text-center py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                        <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {accessLogs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.status === 'Sucesso' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>
                                                        <UserCheck className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-[#05080F]">{log.user}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-xs font-black text-[#05080F]">{log.ip}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tight">
                                                    <Globe className="w-3 h-3" /> {log.location}
                                                </p>
                                            </td>
                                            <td className="py-5 px-4 font-medium text-xs text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="w-3 h-3 text-slate-300" />
                                                    {log.device}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${log.status === 'Sucesso' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-right text-xs font-bold text-slate-400">{log.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Settings & Admins */}
                    <div className="space-y-6">
                        {/* Admin List */}
                        <div className="bg-[#05080F] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#05080F]/20">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black">Administradores</h3>
                                <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                                    <PlusIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                {admins.map((admin) => (
                                    <div key={admin.name} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center font-black group-hover:bg-[#FBC02D] group-hover:text-[#05080F] transition-all">
                                                {admin.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{admin.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{admin.role}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#FBC02D] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Actions */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-[#05080F] mb-6">Configurações Rápidas</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Key className="w-5 h-5 text-[#FBC02D]" />
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[#05080F]">Autenticação 2FA</p>
                                            <p className="text-[10px] font-bold text-slate-400">Ativa para todos os admins</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-6 bg-emerald-500 rounded-full p-1 relative">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[#05080F]">Timeout de Sessão</p>
                                            <p className="text-[10px] font-bold text-slate-400">Padrão: 30 minutos</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#05080F] transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 p-4 border border-red-100 rounded-2xl hover:bg-red-50 text-red-500 transition-all font-black text-sm mt-4">
                                    <LogOut className="w-4 h-4" />
                                    Invalidar Todas as Sessões
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Simplified Icons
const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default AdminSecurity;
