import { LocationDetailView } from "@/src/presentation/components/location/LocationDetailView";
import { LocationDetailPresenterFactory } from "@/src/presentation/presenters/location/LocationDetailPresenter";
import { Metadata } from "next";

interface LocationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { id } = await params;
  const presenter = await LocationDetailPresenterFactory.createServer();
  const viewModel = await presenter.getViewModel(id);

  return {
    title: viewModel.location
      ? `${viewModel.location.name} | RPG Adventure`
      : "Location | RPG Adventure",
    description: viewModel.location?.description || "Explore this location",
  };
}

/**
 * Location Detail Page (Server Component)
 * Follows Clean Architecture pattern
 */
export default async function LocationPage({ params }: LocationPageProps) {
  const { id } = await params;
  // Get presenter instance (server-side)
  const presenter = await LocationDetailPresenterFactory.createServer();

  // Get initial view model
  const initialViewModel = await presenter.getViewModel(id);

  return (
    <LocationDetailView initialViewModel={initialViewModel} locationId={id} />
  );
}
