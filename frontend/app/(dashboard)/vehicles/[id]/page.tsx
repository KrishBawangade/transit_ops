import { VehicleDetails } from "@/lib/features/vehicles/views/fleet-manager/VehicleDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <VehicleDetails id={resolvedParams.id} />;
}
