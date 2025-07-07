import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import { CardSummary } from "./components/CardSummary";
import { BookOpenCheck, UsersRound, Waypoints } from "lucide-react";

export const dataCardsummary = [
  {
    icon: UsersRound,
    total: "12.450",
    average: 15,
    title: "Campaigns",
    tooltipText: "See all of this shit"
  },
  {
    icon: Waypoints,
    total: "86.5%",
    average: 80,
    title: "total Revenue",
    tooltipText: "mish"
  },
  {
    icon: BookOpenCheck,
    total: "333$",
    average: 30,
    title: "Bounce Rate",
    tooltipText: "mirenve"
  },
]

export default function Home() {
  return (
    <div>
      <UserButton />
      <h2 className="text 2xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 mb:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataCardsummary.map(({icon, total, average, title, tooltipText}) => (
          <CardSummary 
            key={title}
            icon={icon}
            total={total}
            average={average}
            title={title}
            tooltipText={tooltipText}
          />
        ))}
      </div>
    </div>
  );
}
