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
    // add a delay to simulate network latency
    .then(
      (response) =>
        new Promise((resolve) => setTimeout(() => resolve(response.data), 1000))
    );

function ChallengeRoute() {
  const navigate = useNavigate();
  const { victim,drink } = useDonationStore();
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
        <img
          src="https://cliply.co/wp-content/uploads/2019/07/371907850_BEER_TOAST_400x400.gif"
          alt=""
        />
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
          If <span className="textgray-600">{victim.name}</span> completes the challenge, you will donate a {drink}.
        </p>
      </div>
      <div className="m-12 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
        {data.map((challenge: Challenge, index: number) => (
          <ChallengeCard key={index} {...challenge} />
        ))}
      </div>
    </div>
  );
}
