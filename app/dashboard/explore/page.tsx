import { ExploreDesk } from "@/components/dashboard/ExploreDesk";
import { liveCatalog } from "@/lib/dashboard/projects";

export const metadata = {
  title: "Explore",
};

export default function ExplorePage() {
  return <ExploreDesk projects={liveCatalog()} />;
}
