import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";

type StepStatus = "completed" | "active" | "inactive";

interface WizardStepProps {
  step: number;
  title: string;
  description: string;
  status: StepStatus;
  children: React.ReactNode;
}

export function WizardStep({
  step,
  title,
  description,
  status,
  children,
}: WizardStepProps) {
  return (
    <Card className={`${status === "inactive" ? "opacity-50" : ""}`}>
      <CardContent className="pt-6 space-y-6">
        <StepIndicator
          step={step}
          title={title}
          description={description}
          status={status}
          size="md"
          layout="horizontal"
        />

        <div className="bg-gray-50 p-6 rounded-lg">{children}</div>
      </CardContent>
    </Card>
  );
}
