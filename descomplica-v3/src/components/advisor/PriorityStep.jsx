import { useTranslation } from "react-i18next";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import { AdvisorStep } from "./AdvisorStep";
import { Button } from "../ui/Button";

export function PriorityStep() {
  const { t } = useTranslation();
  const { step, priority, setPriority, executeSearch, isComputing, isStep3Valid, error } = useAdvisorStore();

  const priorities = [
    { value: "camera_main", label: t('priority.camera', 'Qualidade da Câmera') },
    { value: "battery_endurance", label: t('priority.battery', 'Durabilidade de Bateria') },
    { value: "processing_gaming", label: t('priority.performance', 'Performance em Jogos') },
    { value: "screen_quality", label: t('priority.screen', 'Qualidade de Tela') }
  ];

  return (
    <AdvisorStep
      number={3}
      active={step === 3}
      completed={false}
      title={t("advisor.step3Title")}
      description={t("advisor.step3Desc")}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-lg text-sm text-center font-bold">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          {priorities.map((p) => (
            <label 
              key={p.value}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all group ${
                priority === p.value 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-surface-container border-primary/5 text-text-muted hover:border-primary/20 hover:bg-surface"
              }`}
            >
              <input 
                type="radio" 
                name="priority" 
                value={p.value} 
                checked={priority === p.value}
                onChange={() => setPriority(p.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                 priority === p.value ? "border-primary bg-primary" : "border-primary/20 group-hover:border-primary/40"
              }`}>
                {priority === p.value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`font-black text-sm uppercase tracking-widest ${priority === p.value ? 'text-primary' : 'text-text-muted group-hover:text-text'}`}>{p.label}</span>
            </label>
          ))}
        </div>

        <Button 
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={executeSearch}
          loading={isComputing}
          disabled={!isStep3Valid()}
        >
          {isComputing ? t("advisor.btnComputing") : t("advisor.btnSearch")}
        </Button>
      </div>
    </AdvisorStep>
  );
}
