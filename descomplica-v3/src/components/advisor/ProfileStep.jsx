import { useTranslation } from "react-i18next";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import { AdvisorStep } from "./AdvisorStep";
import { Button } from "../ui/Button";

export function ProfileStep() {
  const { t } = useTranslation();
  const { step, profile, setProfile, nextStep, setStep, isStep2Valid } = useAdvisorStore();

  const options = [
    { value: "balanced", label: "Equilibrado", icon: "⚖️" },
    { value: "gamer", label: "Gamer / Performance", icon: "🎮" },
    { value: "camera", label: "Fotografia", icon: "📸" },
    { value: "battery", label: "Bateria Máxima", icon: "🔋" }
  ];

  return (
    <AdvisorStep
      number={2}
      active={step === 2}
      completed={step > 2}
      title={t("advisor.step2Title")}
      description={t("advisor.step2Desc")}
      onBadgeClick={() => step > 2 && setStep(2)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setProfile(opt.value)}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
              profile === opt.value 
                ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/5" 
                : "bg-surface border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="font-bold text-sm tracking-wide">{opt.label}</span>
          </button>
        ))}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <Button 
            onClick={nextStep} 
            disabled={!isStep2Valid()}
          >
            {t("advisor.btnMap")}
          </Button>
        </div>
      </div>
    </AdvisorStep>
  );
}
