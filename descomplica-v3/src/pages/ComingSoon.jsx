import { Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export function ComingSoon() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500 p-8">
      <div className="w-24 h-24 mb-8 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
        <Compass className="text-primary w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-text text-center tracking-tighter mb-4">
        {t('comingSoon.title', 'Área em Construção')}
      </h1>
      <p className="text-text-muted text-center max-w-lg mb-10 text-lg">
        {t('comingSoon.desc', 'Esta seção faz parte do roadmap da Arquitetura V3 e será liberada em breve com integrações avançadas.')}
      </p>
      
      <Link to="/">
        <Button variant="primary" className="gap-2">
          <ArrowLeft size={18} /> {t('comingSoon.back', 'Voltar ao Site')}
        </Button>
      </Link>
    </div>
  );
}
