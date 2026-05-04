export const basic = `import HealthInsuranceCalculator from "@/components/taiwan/HealthInsuranceCalculator";

export default function NHIEstimator() {
  return <HealthInsuranceCalculator defaultIncome={50000} defaultDependents={1} />;
}`;

export const fullProps = `import { useState } from "react";
import HealthInsuranceCalculator from "@/components/taiwan/HealthInsuranceCalculator";

export default function ControlledNHI() {
  const [income, setIncome] = useState(75000);
  const [dependents, setDependents] = useState(2);

  return (
    <HealthInsuranceCalculator
      income={income}
      onIncomeChange={setIncome}
      dependents={dependents}
      onDependentsChange={setDependents}
      premiumRate={0.0517}
      showAnnual={true}
    />
  );
}`;

export const formIntegration = `// HR onboarding form: pair tax bracket + NHI in one comp summary
import { useState } from "react";
import TaxBracketCalculator from "@/components/taiwan/TaxBracketCalculator";
import HealthInsuranceCalculator from "@/components/taiwan/HealthInsuranceCalculator";

export default function PaycheckCalculator() {
  const [grossMonthly, setGrossMonthly] = useState(75000);
  const annualGross = grossMonthly * 12;
  // Simplified: assumes std deductions; real calc varies by individual
  const taxableIncome = Math.max(0, annualGross - 423000);

  return (
    <div className="space-y-6">
      <h2>Monthly take-home estimator</h2>
      <HealthInsuranceCalculator
        income={grossMonthly}
        onIncomeChange={setGrossMonthly}
      />
      <TaxBracketCalculator income={taxableIncome} />
    </div>
  );
}`;
