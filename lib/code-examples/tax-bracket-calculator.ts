export const basic = `import TaxBracketCalculator from "@/components/taiwan/TaxBracketCalculator";

export default function TaxEstimator() {
  return <TaxBracketCalculator defaultIncome={1000000} />;
}`;

export const fullProps = `import { useState } from "react";
import TaxBracketCalculator from "@/components/taiwan/TaxBracketCalculator";

export default function ControlledTaxCalc() {
  const [income, setIncome] = useState<number | null>(2_000_000);

  return (
    <TaxBracketCalculator
      income={income ?? 0}
      onIncomeChange={setIncome}
      showBreakdown={true}
    />
  );
}`;

export const formIntegration = `import { calculateTax, BRACKETS_2025 } from "@/lib/tax-bracket-tw";

// Use the math directly for server-side calculations or scenario modeling.
const result = calculateTax(2_500_000, BRACKETS_2025);
console.log(result.totalTax);       // 計算出之應納稅額
console.log(result.marginalRate);   // 0.20
console.log(result.effectiveRate);  // ≈ 0.14

export default function ScenarioPlanner() {
  const incomes = [600_000, 1_000_000, 1_500_000, 2_500_000];
  return (
    <table>
      <thead>
        <tr><th>淨所得</th><th>稅額</th><th>有效稅率</th></tr>
      </thead>
      <tbody>
        {incomes.map((i) => {
          const r = calculateTax(i);
          return (
            <tr key={i}>
              <td>{i.toLocaleString()}</td>
              <td>{r.totalTax.toLocaleString()}</td>
              <td>{(r.effectiveRate * 100).toFixed(1)}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}`;
