import ChallengeCard from "@/components/challenge-card";
import Spinner from "@/components/spinner";
import { useDonationStore } from "@/stores/donation";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {config} from "@/Constants.js.ts";
import axios from "axios";

const URL: string = config.url;
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
    .get(`${URL}/api/challenges/`)
    // add a delay to simulate network latency
    .then(
      (response) =>
        new Promise((resolve) => setTimeout(() => resolve(response.data), 1000))
    );

function ChallengeRoute() {
  const navigate = useNavigate();
  const { victim, drink } = useDonationStore();
  if (!victim.name || !victim.email) {
    navigate({ to: "/" });
  }

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  if (isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Choose the challenge!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          If <span className="font-bold">{victim.name}</span> completes the
          challenge, you will donate a{" "}
          <span className="font-bold">{drink.name}</span>.
        </p>
      </div>
      <div className="mx-12 grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2 xl:gap-x-8">
        {data
          .sort((a, b) => a.difficulty - b.difficulty)
          .map((challenge: Challenge, index: number) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
      </div>
    </div>
  );
}
