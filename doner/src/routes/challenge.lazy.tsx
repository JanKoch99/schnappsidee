import challenges, { type Challenge } from "@/assets/challenges";
import ChallengeCard from "@/components/challenge-card";
import { useDonationStore } from "@/stores/donation";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/challenge")({
  component: ChallengeRoute,
});

function ChallengeRoute() {
  const navigate = useNavigate();
  const { name, phone } = useDonationStore();
  if (!name || !phone) {
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-6">
      Your victim is {name} and their phone number is {phone}. You selected the
      following drink for them:
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {challenges
          .sort((a, b) => a.difficulty - b.difficulty)
          .map((challenge: Challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
      </div>
    </div>
  );
}
