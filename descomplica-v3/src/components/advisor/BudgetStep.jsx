import { useTranslation } from "react-i18next";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import { AdvisorStep } from "./AdvisorStep";
import { Button } from "../ui/Button";

export function BudgetStep() {
  const { t } = useTranslation();
  const { step, budget, setBudget, nextStep, setStep, isStep1Valid } = useAdvisorStore();

  return (
    <AdvisorStep
      number={1}
      active={step === 1}
      completed={step > 1}
      title={t("advisor.step1Title")}
      description={t("advisor.step1Desc")}
      onBadgeClick={() => step > 1 && setStep(1)}
    >
      <div className="space-y-4">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">R$</span>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Ex: 3500" 
            className="w-full bg-surface-container border border-primary/10 rounded-lg py-4 pl-12 pr-4 text-text text-lg placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none font-bold" 
          />
        </div>
        <Button 
          onClick={nextStep} 
          disabled={!isStep1Valid()}
          className="w-full sm:w-auto"
        >
          {t("advisor.btnProceed")}
        </Button>
      </div>
    </AdvisorStep>
  );
}
