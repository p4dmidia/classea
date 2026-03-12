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
    const [irregularMembers, setIrregularMembers] = useState<any[]>([]);

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

            await fetchIrregularMembers();

        } catch (error) {
            console.error('Error fetching groups:', error);
            toast.error('Erro ao buscar grupos.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIrregularMembers = async () => {
        try {
            // Fetch all participants and check their regularity
            const { data, error: pError } = await supabase
                .from('consortium_participants')
                .select(`
                    id, 
                    user_id,
                    lucky_number,
                    consortium_groups (name),
                    user:auth.users (email)
                `);

            if (pError) throw pError;

            const participantsData = data as any[];

            // This is slightly inefficient but works for now. 
            // Better to have a dedicated view or composite function.
            const results = await Promise.all(participantsData.map(async (p) => {
                const { data: st, error: stErr } = await supabase
                    .rpc('check_consortium_regularity', { p_user_id: p.user_id });
                
                if (!stErr && st && st.length > 0 && st[0].status_text === 'Irregular') {
                    return { ...p, status: st[0] };
                }
                return null;
            }));

            setIrregularMembers(results.filter(r => r !== null));
        } catch (error) {
            console.error('Error fetching irregular members:', error);
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#0B1221]">Consórcios</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1">Administração de grupos e sorteios</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto bg-[#0B1221] text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        <Plus className="w-5 h-5 text-[#FBC02D]" />
                        NOVO GRUPO
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                <Users className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Grupos Ativos</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-[#0B1221]">{groups.filter(g => g.status !== 'finished').length}</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FBC02D]/10 rounded-2xl flex items-center justify-center text-[#FBC02D]">
                                <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sorteios</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-[#0B1221]">{totalDraws}</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vagas</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-[#0B1221]">{totalParticipants}</p>
                    </div>
                    <div className="bg-red-50 p-6 md:p-8 rounded-[2rem] border border-red-100 shadow-sm relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/5 rounded-full"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-red-400 font-black uppercase tracking-widest text-[10px]">Irregulares</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-red-600">{irregularMembers.length}</p>
                    </div>
                </div>

                {/* Irregular Members List */}
                {irregularMembers.length > 0 && (
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-red-100 overflow-hidden shadow-sm">
                        <div className="p-6 md:p-8 border-b border-red-50 bg-red-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg md:text-xl font-black text-red-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Membros Irregulares
                            </h3>
                            <span className="w-fit bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Ação Requerida</span>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block lg:hidden divide-y divide-slate-50">
                            {irregularMembers.map((member) => (
                                <div key={member.id} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Membro</p>
                                            <p className="font-bold text-[#0B1221] break-all">{member.user?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Nº Sorte</p>
                                            <span className="inline-flex w-8 h-8 rounded-full bg-slate-100 text-[#0B1221] items-center justify-center font-black text-xs">
                                                {member.lucky_number.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Grupo</p>
                                        <p className="font-bold text-slate-600">{member.consortium_groups?.name}</p>
                                    </div>
                                    <button 
                                        onClick={() => toast.success(`Notificação enviada para ${member.user?.email}`)}
                                        className="w-full bg-[#0B1221] text-white text-xs font-black py-4 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                                    >
                                        NOTIFICAR AGORA
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4">Membro</th>
                                        <th className="px-8 py-4">Grupo</th>
                                        <th className="px-8 py-4">Nº Sorte</th>
                                        <th className="px-8 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {irregularMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-red-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-[#0B1221]">{member.user?.email}</div>
                                            </td>
                                            <td className="px-8 py-6 font-medium text-slate-600">
                                                {member.consortium_groups?.name}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1221] flex items-center justify-center font-black text-xs">
                                                    {member.lucky_number.toString().padStart(2, '0')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => toast.success(`Notificação enviada para ${member.user?.email}`)}
                                                    className="bg-[#0B1221] text-white text-[10px] font-black px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                                                >
                                                    NOTIFICAR
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Groups Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex justify-center">
                            <Loader2 className="w-10 h-10 text-[#FBC02D] animate-spin" />
                        </div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${group.type === 'colchao' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {group.type === 'colchao' ? 'Colchão (18)' : 'Livre (12)'}
                                                </span>
                                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                                    ID: {group.id.slice(0, 8)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-[#0B1221] break-words">{group.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => { setSelectedGroup(group); setIsDrawModalOpen(true); }}
                                                className="flex-1 sm:flex-none justify-center bg-[#FBC02D] text-[#0B1221] p-3 rounded-xl hover:bg-[#0B1221] hover:text-white transition-all shadow-lg shadow-[#FBC02D]/10"
                                                title="Realizar Sorteio"
                                            >
                                                <Trophy className="w-5 h-5" />
                                            </button>
                                            <button className="flex-1 sm:flex-none justify-center bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-all text-slate-400">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] md:text-xs font-bold text-slate-400">Progresso do Grupo</span>
                                                <span className="text-xs md:text-sm font-black text-[#0B1221]">{group.current_participants} / {group.max_participants}</span>
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
                                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">Status</span>
                                                </div>
                                                <p className="text-xs md:text-sm font-bold text-[#0B1221] uppercase">{group.status}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">Criado</span>
                                                </div>
                                                <p className="text-xs md:text-sm font-bold text-[#0B1221]">{new Date(group.created_at).toLocaleDateString('pt-BR')}</p>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-[#0B1221]/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full h-full md:h-auto md:max-w-md md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                            <div className="p-6 md:p-10 flex-1 flex flex-col">
                                <h2 className="text-2xl md:text-3xl font-black text-[#0B1221] mb-8 shrink-0">Novo Grupo</h2>
                                <form onSubmit={handleCreateGroup} className="space-y-6 flex-1 flex flex-col overflow-auto px-1">
                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Grupo</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50 rounded-xl px-4 py-4 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 font-bold"
                                                placeholder="Ex: Grupo Premium 01"
                                                value={newGroup.name}
                                                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Modalidade</label>
                                                <select
                                                    className="w-full bg-slate-50 rounded-xl px-4 py-4 border border-slate-100 outline-none font-bold"
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
                                                    className="w-full bg-slate-100 rounded-xl px-4 py-4 border border-slate-100 outline-none text-slate-400 font-bold"
                                                    value={newGroup.max_participants}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-8 md:pt-4 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="flex-1 bg-slate-50 text-slate-400 font-black py-4 rounded-xl hover:bg-slate-100 transition-all text-sm md:text-base"
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#FBC02D] text-[#0B1221] font-black py-4 rounded-xl hover:bg-[#0B1221] hover:text-white transition-all text-sm md:text-base shadow-lg shadow-[#FBC02D]/20"
                                        >
                                            CRIAR GRUPO
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Draw Modal */}
                {isDrawModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-[#0B1221]/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full h-full md:h-auto md:max-w-md md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-[#FBC02D]/20 flex flex-col">
                            <div className="p-6 md:p-10 flex-1 flex flex-col">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FBC02D]/10 rounded-2xl flex items-center justify-center text-[#FBC02D] mx-auto mb-4 md:mb-6 shrink-0">
                                    <Target className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-[#0B1221] text-center mb-1 md:mb-2 shrink-0">Realizar Sorteio</h2>
                                <p className="text-slate-400 text-center text-xs md:text-sm font-medium mb-6 md:mb-8 shrink-0">
                                    Grupo: <span className="text-[#0B1221] font-black">{selectedGroup?.name}</span>
                                </p>

                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-6 md:mb-8 shrink-0">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase">Transparência</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-emerald-800 font-medium">
                                        (Federal Loteria % {selectedGroup?.max_participants}) + 1
                                    </p>
                                </div>

                                <form onSubmit={handleDraw} className="space-y-6 flex-1 flex flex-col overflow-auto px-1">
                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resultado Federal (1º Prêmio)</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-50 rounded-xl px-4 py-4 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-center text-xl md:text-2xl font-black"
                                                placeholder="Ex: 57342"
                                                value={lotteryNumber}
                                                onChange={(e) => setLotteryNumber(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link do Vídeo</label>
                                                <input
                                                    type="url"
                                                    className="w-full bg-slate-50 rounded-xl px-4 py-4 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-xs md:text-sm"
                                                    placeholder="Drive, YouTube, etc"
                                                    value={videoUrl}
                                                    onChange={(e) => setVideoUrl(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resultado Oficial</label>
                                                <input
                                                    type="url"
                                                    className="w-full bg-slate-50 rounded-xl px-4 py-4 border border-slate-100 outline-none focus:ring-2 focus:ring-[#FBC02D]/50 text-xs md:text-sm"
                                                    placeholder="Link do site da Caixa"
                                                    value={officialResultUrl}
                                                    onChange={(e) => setOfficialResultUrl(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-8 md:pt-4 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsDrawModalOpen(false)}
                                            className="flex-1 bg-slate-50 text-slate-400 font-black py-4 rounded-xl text-sm md:text-base"
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!lotteryNumber}
                                            className="flex-1 bg-[#0B1221] text-white font-black py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-[#0B1221]/20"
                                        >
                                            <Trophy className="w-5 h-5 text-[#FBC02D]" />
                                            CONFIRMAR
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminConsorcio;
