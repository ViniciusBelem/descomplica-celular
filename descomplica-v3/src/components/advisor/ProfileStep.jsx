import { useTranslation } from "react-i18next";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import { AdvisorStep } from "./AdvisorStep";
import { Button } from "../ui/Button";

export function ProfileStep() {
  const { t } = useTranslation();
  const { step, profile, setProfile, nextStep, setStep, isStep2Valid } = useAdvisorStore();

  const options = [
    { value: "balanced", label: t('profile.balanced', 'Equilibrado'), icon: "⚖️" },
    { value: "gamer", label: t('profile.gamer', 'Gamer / Performance'), icon: "🎮" },
    { value: "camera", label: t('profile.camera', 'Fotografia'), icon: "📸" },
    { value: "battery", label: t('profile.battery', 'Bateria Máxima'), icon: "🔋" }
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
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
              profile === opt.value 
                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5" 
                : "bg-surface-container border-primary/5 text-text-muted hover:border-primary/20 hover:bg-surface"
            }`}
          >
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{opt.icon}</span>
            <span className={`font-black text-sm tracking-wide ${profile === opt.value ? 'text-primary' : 'text-text-muted group-hover:text-text'}`}>{opt.label}</span>
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
