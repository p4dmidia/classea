import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ReferralHandler: React.FC = () => {
    const { referralCode } = useParams<{ referralCode: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (referralCode) {
            console.log('Capturando código de indicação:', referralCode);

            // Armazena o código de indicação em um cookie por 30 dias
            // O cookie estará disponível em todo o domínio
            Cookies.set('classea_ref', referralCode, {
                expires: 30,
                path: '/',
                sameSite: 'lax'
            });

            // Opcional: Você pode logar o clique no banco de dados aqui no futuro
        }

        // Redireciona para a home após capturar
        // Podemos usar um pequeno timeout se quisermos mostrar uma tela de "Carregando"
        navigate('/', { replace: true });
    }, [referralCode, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FBC02D] mx-auto mb-4"></div>
                <h2 className="text-xl font-black text-[#0B1221] uppercase tracking-widest">Processando Indicação...</h2>
                <p className="text-slate-500 mt-2">Estamos preparando as melhores ofertas para você.</p>
            </div>
        </div>
    );
};

export default ReferralHandler;
