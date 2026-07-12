import { VehicleEdit } from "@/lib/features/vehicles/views/fleet-manager/VehicleEdit";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <VehicleEdit id={resolvedParams.id} />;
}
