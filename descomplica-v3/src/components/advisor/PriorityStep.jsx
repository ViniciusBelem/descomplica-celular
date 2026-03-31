import { useTranslation } from "react-i18next";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import { AdvisorStep } from "./AdvisorStep";
import { Button } from "../ui/Button";

export function PriorityStep() {
  const { t } = useTranslation();
  const { step, priority, setPriority, executeSearch, isComputing, isStep3Valid } = useAdvisorStore();

  const priorities = [
    { value: "camera_main", label: "Qualidade da Câmera" },
    { value: "battery_endurance", label: "Durabilidade de Bateria" },
    { value: "processing_gaming", label: "Performance em Jogos" },
    { value: "screen_quality", label: "Qualidade de Tela" }
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
        <div className="grid grid-cols-1 gap-2">
          {priorities.map((p) => (
            <label 
              key={p.value}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all ${
                priority === p.value 
                  ? "bg-secondary/10 border-secondary text-white" 
                  : "bg-surface border-white/5 text-gray-500 hover:border-white/10"
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
                 priority === p.value ? "border-secondary bg-secondary" : "border-white/20"
              }`}>
                {priority === p.value && <div className="w-2 h-2 bg-black rounded-full" />}
              </div>
              <span className="font-medium">{p.label}</span>
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
