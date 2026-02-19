
import React from 'react';
import { Mail, Phone, MapPin, Share2, Globe, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="Classe A" className="h-16 w-auto" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Líder em produtos de bem-estar e oportunidades de negócios. Qualidade de vida e independência financeira em um só lugar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FBC02D] transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FBC02D] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#FBC02D] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">Categorias</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Colchões Magnéticos</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Moda Masculina</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Moda Feminina</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Calçados de Luxo</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Consórcio Classe A</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">Institucional</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Negócio Classe A (MMN)</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Seja um Afiliado</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-[#FBC02D] transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">Atendimento</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FBC02D]" />
                contato@classea.com.br
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FBC02D]" />
                0800 777 4000
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FBC02D] shrink-0" />
                Av. Paulista, 1000 - São Paulo/SP
              </li>
            </ul>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="border-t border-slate-100 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-slate-400 text-xs">
            © 2024 Classe A Gold. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <img src="https://picsum.photos/id/1/200/100" alt="Certificado" className="h-10 w-auto object-contain rounded border border-slate-200" />
            <div className="flex items-center gap-4 bg-[#0B1221] p-4 rounded-xl text-white">
              <div className="text-right">
                <p className="text-[8px] font-bold tracking-[0.2em] opacity-60">MARRA</p>
                <p className="text-lg font-black leading-none">MASTT</p>
                <p className="text-[6px] opacity-40">SABER SER NAME</p>
              </div>
              <div className="w-8 h-8 bg-[#FBC02D] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
