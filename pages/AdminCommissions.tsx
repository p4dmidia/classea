
import React, { useState } from 'react';
import {
    Percent,
    Coins,
    Info,
    Save,
    RefreshCcw,
    Layers,
    ChevronRight,
    TrendingUp,
    Settings2,
    ShieldCheck
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface CommissionLevel {
    level: number;
    value: number;
}

const AdminCommissions: React.FC = () => {
    // Geral State (7 Generations)
    const [geralType, setGeralType] = useState<'percent' | 'money'>('percent');
    const [geralGens, setGeralGens] = useState(7);
    const [geralLevels, setGeralLevels] = useState<CommissionLevel[]>([
        { level: 1, value: 10 },
        { level: 2, value: 4 },
        { level: 3, value: 2 },
        { level: 4, value: 2 },
        { level: 5, value: 2 },
        { level: 6, value: 2 },
        { level: 7, value: 1 },
    ]);

    // Colchões State (6 Generations)
    const [mattressType, setMattressType] = useState<'percent' | 'money'>('percent');
    const [mattressGens, setMattressGens] = useState(6);
    const [mattressLevels, setMattressLevels] = useState<CommissionLevel[]>([
        { level: 1, value: 20 },
        { level: 2, value: 4 },
        { level: 3, value: 4 },
        { level: 4, value: 4 },
        { level: 5, value: 4 },
        { level: 6, value: 4 },
    ]);

    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const updateLevelValue = (type: 'geral' | 'mattress', level: number, newValue: number) => {
        if (type === 'geral') {
            setGeralLevels(prev => prev.map(l => l.level === level ? { ...l, value: newValue } : l));
        } else {
            setMattressLevels(prev => prev.map(l => l.level === level ? { ...l, value: newValue } : l));
        }
    };

    const renderLevelInputs = (type: 'geral' | 'mattress', count: number, levels: CommissionLevel[], typeVal: 'percent' | 'money') => {
        return levels.slice(0, count).map((lvl) => (
            <div key={lvl.level} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-[#FBC02D] transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#05080F] shadow-sm text-xs">
                    {lvl.level}º
                </div>
                <div className="flex-grow">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Geração {lvl.level}</p>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.1"
                            value={lvl.value}
                            onChange={(e) => updateLevelValue(type, lvl.level, parseFloat(e.target.value))}
                            className="bg-transparent text-sm font-black text-[#05080F] outline-none w-full"
                        />
                        <span className="absolute right-0 top-0 text-slate-300 font-bold">{typeVal === 'percent' ? '%' : 'R$'}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#05080F]">Regras de Bonificação</h1>
                        <p className="text-slate-500 font-medium">Configure a distribuição de comissões por gerações e categorias.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:shadow-md transition-all whitespace-nowrap"
                        >
                            <RefreshCcw className="w-4 h-4 text-slate-400" />
                            Resetar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-[#05080F] text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-[#05080F]/10 hover:bg-[#1a2436] transition-all whitespace-nowrap"
                        >
                            <Save className="w-4 h-4 text-[#FBC02D]" />
                            Salvar Alterações
                        </button>
                    </div>
                </div>

                {/* Main Info Card */}
                <div className="bg-[#05080F] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBC02D]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
                            <ShieldCheck className="w-10 h-10 text-[#FBC02D]" />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-2xl font-black mb-2">Segurança de Matriz Unilever</h2>
                            <p className="text-slate-400 max-w-2xl font-medium">As porcentagens abaixo são aplicadas em cascata. O sistema calcula automaticamente a distribuição no momento da confirmação do pagamento de cada pedido.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Distribuído (Geral)</p>
                                <p className="text-xl font-black text-[#FBC02D]">
                                    {geralLevels.slice(0, geralGens).reduce((acc, curr) => acc + curr.value, 0).toFixed(1)}%
                                </p>
                            </div>
                            <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total (Colchões)</p>
                                <p className="text-xl font-black text-[#FBC02D]">
                                    {mattressLevels.slice(0, mattressGens).reduce((acc, curr) => acc + curr.value, 0).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Geral Configuration */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-600">
                                    <Settings2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#05080F]">Catálogo Geral</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Até 7 Gerações</p>
                                </div>
                            </div>

                            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                <button
                                    onClick={() => setGeralType('percent')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${geralType === 'percent' ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400'}`}
                                >
                                    %
                                </button>
                                <button
                                    onClick={() => setGeralType('money')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${geralType === 'money' ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400'}`}
                                >
                                    R$
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gerações Ativas: <span className="text-[#05080F]">{geralGens}</span></label>
                                    <span className="text-[10px] font-black text-[#FBC02D] uppercase tracking-widest">Unilever Aberta</span>
                                </div>
                                <input
                                    type="range" min="1" max="7"
                                    value={geralGens}
                                    onChange={(e) => setGeralGens(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FBC02D]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                {renderLevelInputs('geral', geralGens, geralLevels, geralType)}
                            </div>
                        </div>
                    </div>

                    {/* Colchões Configuration */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-amber-50 rounded-2xl text-[#FBC02D]">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#05080F]">Linha de Colchões</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Até 6 Gerações</p>
                                </div>
                            </div>

                            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                <button
                                    onClick={() => setMattressType('percent')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${mattressType === 'percent' ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400'}`}
                                >
                                    %
                                </button>
                                <button
                                    onClick={() => setMattressType('money')}
                                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${mattressType === 'money' ? 'bg-white shadow-sm text-[#05080F]' : 'text-slate-400'}`}
                                >
                                    R$
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gerações Ativas: <span className="text-[#05080F]">{mattressGens}</span></label>
                                    <span className="text-[10px] font-black text-[#FBC02D] uppercase tracking-widest">Bonificação Especial</span>
                                </div>
                                <input
                                    type="range" min="1" max="6"
                                    value={mattressGens}
                                    onChange={(e) => setMattressGens(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FBC02D]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                {renderLevelInputs('mattress', mattressGens, mattressLevels, mattressType)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <Info className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-black text-[#05080F]">Informação Importante</h4>
                        <p className="text-slate-500 text-sm font-medium">As novas regras entram em vigor imediatamente para todos os novos pedidos. Pedidos já realizados mantêm a bonificação do momento em que foram gerados.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full md:w-auto px-10 py-4 bg-[#FBC02D] text-[#05080F] rounded-2xl font-black text-sm shadow-xl shadow-[#FBC02D]/10 hover:shadow-2xl transition-all"
                    >
                        CONFIRMAR E ATUALIZAR REGRAS
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#05080F] text-[#FBC02D] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 border-2 border-[#FBC02D] rounded-full" />
                    Regras de comissão atualizadas com sucesso!
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCommissions;
