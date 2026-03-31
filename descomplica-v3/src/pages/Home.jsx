import { useTranslation } from 'react-i18next';
import AdvisorForm from '../components/AdvisorForm';

/**
 * Home Page (Landing & Advisor Flow)
 * Extracted from the monolithic App.jsx into a dedicated Page component.
 */
export function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="mb-20">
        <span className="text-secondary tracking-[0.3em] text-xs font-bold mb-6 block uppercase">Precision Algorithm</span>
        <h1 className="text-4xl sm:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
          A Arte da Escolha. <br/> Redefinida.
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Descomplicamos o mercado de celulares. Use o nosso Algoritmo Dinâmico para descobrir o smartphone ideal para seu orçamento e perfil de uso, em menos de 10 segundos.
        </p>
      </div>

      {/* The Central Engine */}
      <AdvisorForm />
    </div>
  );
}
