import ChallengeCard from "@/components/challenge-card";
import { useDonationStore } from "@/stores/donation";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";

export const Route = createLazyFileRoute("/challenge")({
  component: ChallengeRoute,
});

export type Challenge = {
  _id: string;
  task: string;
  difficulty: 0 | 1 | 2;
  createdAt: string;
  updatedAt: string;
};

const fetchChallenges: QueryFunction<Challenge[], string[], never> = () =>
  axios
    .get(`http://localhost:4000/api/challenges/`)
    .then((response) => response.data);

function ChallengeRoute() {
  const navigate = useNavigate();
  const { victim } = useDonationStore();
  if (!victim.name || !victim.email) {
    navigate({ to: "/" });
  }

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((challenge: Challenge, index: number) => (
          <ChallengeCard key={index} {...challenge} />
        ))}
      </div>
    </div>
  );
}
