import React, { useEffect, useState, useCallback } from 'react';
import Tree from 'react-d3-tree';
import { supabase } from '../lib/supabase';
import { Loader2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface AffiliateNode {
    name: string;
    attributes?: {
        email?: string;
        level?: number;
        id?: string;
    };
    children?: AffiliateNode[];
}

interface AffiliateNetworkProps {
    rootAffiliateId?: string;
}

export const AffiliateNetwork: React.FC<AffiliateNetworkProps> = ({ rootAffiliateId }) => {
    const [treeData, setTreeData] = useState<AffiliateNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.8);

    const containerRef = useCallback((containerElem: HTMLDivElement | null) => {
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();
            setTranslate({ x: width / 2, y: height / 5 });
        }
    }, []);

    const buildTree = async (rootId: string): Promise<AffiliateNode | null> => {
        try {
            // Fetch all relevant affiliates to build tree in memory (more efficient for smaller trees)
            // For very large trees, we might need a different approach
            const { data: allAffiliates, error } = await supabase
                .from('affiliates')
                .select('id, full_name, email, sponsor_id')
                .filter('is_active', 'eq', true);

            if (error) throw error;

            const affiliateMap = new Map<string, AffiliateNode>();

            // First pass: Create all nodes
            allAffiliates.forEach(aff => {
                affiliateMap.set(aff.id, {
                    name: aff.full_name || 'Sem nome',
                    attributes: {
                        email: aff.email,
                        id: aff.id
                    },
                    children: []
                });
            });

            // Second pass: Build hierarchy
            let rootNode: AffiliateNode | null = null;

            allAffiliates.forEach(aff => {
                const node = affiliateMap.get(aff.id)!;
                if (aff.id === rootId) {
                    rootNode = node;
                } else if (aff.sponsor_id && affiliateMap.has(aff.sponsor_id)) {
                    affiliateMap.get(aff.sponsor_id)!.children!.push(node);
                }
            });

            // If rootId wasn't found in allAffiliates but exists (maybe it's the top admin), 
            // we might need to fetch it specifically if it's not in the 'affiliates' active list
            if (!rootNode) {
                const { data: specificRoot, error: rootError } = await supabase
                    .from('affiliates')
                    .select('id, full_name, email')
                    .eq('id', rootId)
                    .single();

                if (specificRoot) {
                    rootNode = {
                        name: specificRoot.full_name || 'Sem nome',
                        attributes: {
                            email: specificRoot.email,
                            id: specificRoot.id
                        },
                        children: []
                    };
                    // Add children that have this root as sponsor
                    allAffiliates.forEach(aff => {
                        if (aff.sponsor_id === rootId) {
                            rootNode?.children?.push(affiliateMap.get(aff.id)!);
                        }
                    });
                }
            }

            return rootNode;
        } catch (err: any) {
            console.error('Error building tree:', err);
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            let id = rootAffiliateId;

            if (!id) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('affiliates')
                        .select('id')
                        .eq('user_id', user.id)
                        .single();
                    if (profile) id = profile.id;
                }
            }

            if (id) {
                const data = await buildTree(id);
                if (data) {
                    setTreeData(data);
                } else {
                    setError('Não foi possível carregar os dados da rede.');
                }
            } else {
                setError('Usuário não identificado.');
            }

            setLoading(false);
        };

        loadData();
    }, [rootAffiliateId]);

    const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
        <g>
            <circle r="15" fill={nodeDatum.children?.length ? "#c1a35f" : "#4a4a4a"} stroke="#fff" strokeWidth="2" onClick={toggleNode} />
            <text fill="white" strokeWidth="0.5" x="20" dy="5" fontSize="14" className="font-medium shadow-sm">
                {nodeDatum.name}
            </text>
            {nodeDatum.attributes?.email && (
                <text fill="#a0a0a0" x="20" dy="22" fontSize="10">
                    {nodeDatum.attributes.email}
                </text>
            )}
        </g>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-black/40 rounded-xl border border-gold/20">
                <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                <p className="text-gray-400">Carregando visualização de rede...</p>
            </div>
        );
    }

    if (error || !treeData) {
        return (
            <div className="flex items-center justify-center h-96 bg-black/40 rounded-xl border border-red-500/20">
                <p className="text-red-400">{error || 'Dados indisponíveis'}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] bg-black/60 rounded-xl border border-gold/30 overflow-hidden" ref={containerRef}>
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {/* Controls could be added here */}
                <div className="bg-black/80 p-2 rounded-lg border border-gold/30 text-xs text-gold/70">
                    Arraste para mover • Scroll para zoom
                </div>
            </div>

            <Tree
                data={treeData}
                translate={translate}
                scaleExtent={{ min: 0.1, max: 2 }}
                zoom={zoom}
                orientation="vertical"
                pathFunc="step"
                renderCustomNodeElement={renderCustomNode}
                separation={{ siblings: 2, nonSiblings: 2 }}
                nodeSize={{ x: 200, y: 100 }}
                styles={{
                    links: {
                        stroke: '#c1a35f',
                        strokeWidth: 1,
                        opacity: 0.5
                    }
                }}
            />
        </div>
    );
};
