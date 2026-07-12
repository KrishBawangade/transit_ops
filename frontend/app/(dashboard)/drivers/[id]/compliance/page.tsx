import { DriverComplianceDetails } from "@/features/drivers/views/safety-officer/DriverComplianceDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DriverComplianceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DriverComplianceDetails id={resolvedParams.id} />;
}
