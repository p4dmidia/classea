
import React, { useState } from 'react';
import {
    Download,
    Copy,
    Check,
    Video,
    Image as ImageIcon,
    FileText,
    Search,
    PlayCircle,
    FileVideo,
    Share2,
    Library,
    ChevronRight
} from 'lucide-react';
import AffiliateLayout from '../components/AffiliateLayout';

interface Material {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'banner' | 'script';
    thumbnail?: string;
    content?: string; // For scripts
}

const AffiliateMaterials: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'video' | 'banner' | 'script'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const materials: Material[] = [
        {
            id: '1',
            title: 'Vídeo Institucional Classe A',
            description: 'Vídeo de 30 segundos ideal para Reels e TikTok apresentando a marca.',
            type: 'video',
            thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: '2',
            title: 'Banner Colchão Magnético Gold',
            description: 'Arte em alta resolução para Stories do WhatsApp e Instagram.',
            type: 'banner',
            thumbnail: 'https://images.unsplash.com/photo-1544161515-4af6b1d4640d?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: '3',
            title: 'Script de Abordagem Direta',
            description: 'Texto pronto para enviar para amigos e familiares no WhatsApp.',
            type: 'script',
            content: 'Olá! Tudo bem? Recentemente conheci a Classe A e seus produtos magnéticos que estão me ajudando muito com o sono. Dá uma olhada no site deles, se gostar de algo posso te indicar: [SEU_LINK]'
        },
        {
            id: '4',
            title: 'Depoimento: Alinhamento de Coluna',
            description: 'Vídeo depoimento de cliente real sobre melhora em dores lombares.',
            type: 'video',
            thumbnail: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=400&auto=format&fit=crop'
        },
        {
            id: '5',
            title: 'Banner Oportunidade de Negócio',
            description: 'Arte focada em recrutar novos vendedores para sua rede.',
            type: 'banner',
            thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop'
        },
    ];

    const filteredMaterials = materials.filter(m => activeTab === 'all' || m.type === activeTab);

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AffiliateLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#0B1221]">Materiais de Apoio</h1>
                        <p className="text-slate-500 font-medium">Ferramentas prontas para você divulgar e vender mais.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar material..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#FBC02D] transition-all"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl w-fit border border-slate-100">
                    {[
                        { id: 'all', label: 'Todos', icon: Library },
                        { id: 'video', label: 'Vídeos', icon: Video },
                        { id: 'banner', label: 'Banners', icon: ImageIcon },
                        { id: 'script', label: 'Scripts', icon: FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#0B1221] text-[#FBC02D] shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMaterials.map(item => (
                        <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#FBC02D]/10 transition-all duration-500 flex flex-col">
                            {/* Material Preview */}
                            <div className="aspect-video relative overflow-hidden bg-slate-50">
                                {item.type !== 'script' ? (
                                    <>
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-[#0B1221]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {item.type === 'video' ? (
                                                <PlayCircle className="w-16 h-16 text-white" />
                                            ) : (
                                                <ImageIcon className="w-16 h-16 text-white" />
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50 group-hover:bg-slate-100 transition-colors">
                                        <FileText className="w-16 h-16 text-[#FBC02D] opacity-20" />
                                        <div className="absolute inset-0 p-6 flex flex-col justify-center overflow-hidden">
                                            <p className="text-[10px] font-bold text-slate-400 italic mb-2">Exemplo do Script:</p>
                                            <p className="text-[9px] text-slate-400 font-medium line-clamp-3">{item.content}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-[#0B1221] shadow-sm">
                                        {item.type}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8 space-y-3 flex-grow">
                                <h3 className="text-lg font-black text-[#0B1221] leading-tight group-hover:text-[#FBC02D] transition-colors">{item.title}</h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="p-8 pt-0 mt-auto">
                                {item.type === 'script' ? (
                                    <button
                                        onClick={() => handleCopy(item.id, item.content || '')}
                                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${copiedId === item.id ? 'bg-emerald-500 text-white' : 'bg-[#0B1221] text-white hover:bg-[#FBC02D] hover:text-[#0B1221]'
                                            }`}
                                    >
                                        {copiedId === item.id ? (
                                            <>
                                                <Check className="w-4 h-4" /> COPIADO!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" /> COPIAR TEXTO
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-[#0B1221] hover:text-white hover:border-[#0B1221] transition-all">
                                        <Download className="w-4 h-4" /> DOWNLOAD
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Share Tips */}
                <div className="bg-[#0B1221] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FBC02D]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-[#FBC02D] rounded-2xl flex items-center justify-center text-[#0B1221]">
                                <Share2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black leading-tight">Dicas de Compartilhamento</h3>
                            <p className="text-slate-400 font-bold leading-relaxed">
                                Use o seu link de afiliado personalizado em cada postagem. Lembre-se: o segredo da venda é a constância e o relacionamento.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    <span className="text-xs font-bold text-slate-300">Responda todos os comentários em 30 min.</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    <span className="text-xs font-bold text-slate-300">Poste nos Stories pelo menos 3x ao dia.</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                                    <span className="text-xs font-bold text-slate-300">Compartilhe depoimentos reais de sono.</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
                            <FileVideo className="w-12 h-12 text-[#FBC02D] mb-4" />
                            <h4 className="text-xl font-black">Precisa de Treinamento?</h4>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">Acesse nossa plataforma de cursos exclusiva para Afiliados Diamante e aprenda técnicas avançadas de tráfego pago e network marketing.</p>
                            <button className="text-[#FBC02D] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                                ACESSAR TREINAMENTO <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AffiliateLayout>
    );
};

export default AffiliateMaterials;
