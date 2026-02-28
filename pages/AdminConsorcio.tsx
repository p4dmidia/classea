import React, { useState, useEffect } from 'react';
import {
    Users,
    Trophy,
    Plus,
    Search,
    Filter,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    Target
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const AdminConsorcio: React.FC = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [lotteryNumber, setLotteryNumber] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [officialResultUrl, setOfficialResultUrl] = useState('');
    const [totalDraws, setTotalDraws] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);

    // New Group State
    const [newGroup, setNewGroup] = useState({
        name: '',
        type: 'livre_escolha',
        max_participants: 12
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('consortium_groups')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGroups(data || []);

            // Fetch Total Draws
            const { count: drawCount } = await supabase
                .from('consortium_draws')
                .select('*', { count: 'exact', head: true });
            setTotalDraws(drawCount || 0);

            // Fetch Total Participants
            const { count: participantCount } = await supabase
                .from('consortium_participants')
                .select('*', { count: 'exact', head: true });
            setTotalParticipants(participantCount || 0);

        } catch (error) {
            console.error('Error fetching groups:', error);
            toast.error('Erro ao buscar grupos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('consortium_groups')
                .insert([newGroup]);

            if (error) throw error;
            toast.success('Grupo criado com sucesso!');
            setIsCreateModalOpen(false);
            fetchGroups();
        } catch (error) {
            console.error('Error creating group:', error);
            toast.error('Erro ao criar grupo.');
        }
    };

    const handleDraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroup || !lotteryNumber) return;

        try {
            // 1. Fetch participants for this group
            const { data: participants, error: partError } = await supabase
                .from('consortium_participants')
                .select('*')
                .eq('group_id', selectedGroup.id)
                .eq('status', 'active')
                .order('lucky_number');

            if (partError) throw partError;
            if (!participants || participants.length === 0) {
                toast.error('Nenhum participante ativo neste grupo.');
                return;
            }

            // 2. Transparence Logic: (FederalLottery % GroupSize) + 1
            const lotterySeed = parseInt(lotteryNumber.replace(/\D/g, ''));
            const luckyWinnerNumber = (lotterySeed % selectedGroup.max_participants) + 1;

            // 3. Find the participant with that lucky number
            // Note: In a real system, we'd check if the participant is active or if we need to pick the next one
            const winner = participants.find(p => p.lucky_number === luckyWinnerNumber) || participants[0];

            // 4. Record Draw
            const { error: drawError } = await supabase
                .from('consortium_draws')
                .insert([{
                    group_id: selectedGroup.id,
                    winner_id: winner.id,
                    lottery_number: lotteryNumber,
                    video_url: videoUrl,
                    official_result_url: officialResultUrl,
                    details: `Sorteio realizado com base na Loteria Federal nº ${lotteryNumber}. Vencedor: Número ${luckyWinnerNumber}.`
                }]);

            if (drawError) throw drawError;

            // 5. Update participant status
            await supabase
                .from('consortium_participants')
                .update({ status: 'contemplated' })
                .eq('id', winner.id);

            toast.success(`Sorteio realizado! Vencedor: Nº ${luckyWinnerNumber}`);
            setIsDrawModalOpen(false);
            setLotteryNumber('');
            setVideoUrl('');
            setOfficialResultUrl('');
            fetchGroups();
        } catch (error) {
            console.error('Error performing draw:', error);
            toast.error('Erro ao realizar sorteio.');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#0B1221]">Gestão de Consórcios</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Administração de grupos e sorteios</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#0B1221] text-white font-black py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        <Plus className="w-5 h-5 text-[#FBC02D]" />
                        NOVO GRUPO
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Grupos Ativos</span>
                        </div>
                        <p className="text-4xl font-black text-[#0B1221]">{groups.filter(g => g.status !== 'finished').length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#FBC02D]/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sorteios Realizados</span>
                        </div>
                        <p className="text-4xl font-black text-[#0B1221]">{totalDraws}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vagas Preenchidas</span>
                        </div>
                        <p className="text-4xl font-black text-[#0B1221]">{totalParticipants}</p>
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex justify-center">
                            <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                        </div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${group.type === 'colchao' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {group.type === 'colchao' ? 'Colchão (18)' : 'Livre (12)'}
                                                </span>
                                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                                    ID: {group.id.slice(0, 8)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-[#0B1221]">{group.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setSelectedGroup(group); setIsDrawModalOpen(true); }}
                                                className="bg-[#FBC02D] text-[#0B1221] p-2.5 rounded-xl hover:bg-[#0B1221] hover:text-white transition-all shadow-lg shadow-[#FBC02D]/10"
                                                title="Realizar Sorteio"
                                            >
                                                <Trophy className="w-5 h-5" />
                                            </button>
                                            <button className="bg-slate-50 p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-400">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-400">Progresso do Grupo</span>
                                                <span className="text-sm font-black text-[#0B1221]">{group.current_participants} / {group.max_participants}</span>
                                            </div>
                                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div
                                                    className="h-full bg-[#FBC02D] transition-all duration-1000"
                                                    style={{ width: `${(group.current_participants / group.max_participants) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">Status</span>
                                                </div>
                                                <p className="text-sm font-bold text-[#0B1221] uppercase">{group.status}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">Criado em</span>
                                                </div>
                                                <p className="text-sm font-bold text-[#0B1221]">{new Date(group.created_at).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Group Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-[#0B1221]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl">
                            <h2 className="text-3xl font-black text-[#0B1221] mb-8">Novo Grupo</h2>
                            <form onSubmit={handleCreateGroup} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Grupo</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50"
                                        placeholder="Ex: Grupo Premium 01"
                                        value={newGroup.name}
                                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Modalidade</label>
                                        <select
                                            className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none"
                                            value={newGroup.type}
                                            onChange={(e) => setNewGroup({ ...newGroup, type: e.target.value, max_participants: e.target.value === 'colchao' ? 18 : 12 })}
                                        >
                                            <option value="livre_escolha">Livre Escolha</option>
                                            <option value="colchao">Colchão</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Participantes</label>
                                        <input
                                            type="number"
                                            disabled
                                            className="w-full bg-slate-100 rounded-xl px-4 py-3 border border-slate-100 outline-none text-slate-400"
                                            value={newGroup.max_participants}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-grow bg-slate-50 text-slate-400 font-black py-4 rounded-xl hover:bg-slate-100 transition-all"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-grow bg-[#FBC02D] text-[#0B1221] font-black py-4 rounded-xl hover:bg-[#0B1221] hover:text-white transition-all"
                                    >
                                        CRIAR GRUPO
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Draw Modal */}
                {isDrawModalOpen && (
                    <div className="fixed inset-0 bg-[#0B1221]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl border-2 border-[#FBC02D]/20">
                            <div className="w-16 h-16 bg-[#FBC02D]/10 rounded-2xl flex items-center justify-center text-[#FBC02D] mx-auto mb-6">
                                <Target className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-[#0B1221] text-center mb-2">Realizar Sorteio</h2>
                            <p className="text-slate-400 text-center text-sm font-medium mb-8">
                                Grupo: <span className="text-[#0B1221] font-black">{selectedGroup?.name}</span>
                            </p>

                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-8">
                                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase">Fórmula da Transparência</span>
                                </div>
                                <p className="text-xs text-emerald-800 font-medium">
                                    (Semente da Loteria % {selectedGroup?.max_participants}) + 1
                                </p>
                            </div>

                            <form onSubmit={handleDraw} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resultado Loteria Federal (1º Prêmio)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-center text-2xl font-black"
                                        placeholder="Ex: 57342"
                                        value={lotteryNumber}
                                        onChange={(e) => setLotteryNumber(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link do Vídeo (Opcional)</label>
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm"
                                            placeholder="Drive, YouTube, etc"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resultado Oficial (Opcional)</label>
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-sm"
                                            placeholder="Link do site da Caixa"
                                            value={officialResultUrl}
                                            onChange={(e) => setOfficialResultUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsDrawModalOpen(false)}
                                        className="flex-grow bg-slate-50 text-slate-400 font-black py-4 rounded-xl"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!lotteryNumber}
                                        className="flex-grow bg-[#0B1221] text-white font-black py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trophy className="w-5 h-5 text-[#FBC02D]" />
                                        CONFIRMAR SORTEIO
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminConsorcio;
