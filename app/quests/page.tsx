import { QuestPresenterFactory } from "@/src/presentation/presenters/quest/QuestPresenter";
import { QuestView } from "@/src/presentation/components/quest/QuestView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest Log | RPG Adventure",
  description: "Track your quests and complete adventures to earn rewards",
};

/**
 * Quests Page (Server Component)
 * Follows Clean Architecture pattern
 */
export default async function QuestsPage() {
  // Get presenter instance (server-side)
  const presenter = await QuestPresenterFactory.createServer();
  
  // Get initial view model (with empty progress for now)
  const initialViewModel = await presenter.getViewModel([], []);

  return <QuestView initialViewModel={initialViewModel} />;
}
