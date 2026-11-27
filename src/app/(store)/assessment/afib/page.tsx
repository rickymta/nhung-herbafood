import { AssessmentWizard } from "@/components/store/AssessmentWizard";
export const metadata = { title: "Tầm soát Rung nhĩ CHA₂DS₂-VASc — TNStrokeGuard" };
export default function Page() {
  return <AssessmentWizard type="afib" />;
}
