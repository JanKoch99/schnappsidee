import { Card } from "@/components/ui/card";
import { Challenge } from "@/routes/challenge.lazy";
import { useDonationStore } from "@/stores/donation";
import clsx from "clsx";
import React from "react";

const ChallengeCard: React.FC<Challenge & { active?: boolean }> = ({
  _id,
  task,
  difficulty,
  active,
}) => {
  const { setChallenge, challenge } = useDonationStore();

  const colors = {
    2: "bg-red-100 border-2 border-red-500",
    0: "bg-green-100 border-2 border-green-500",
    1: "bg-yellow-100 border-2 border-yellow-500",
  };

  return (
    <Card
      onClick={() => setChallenge(_id)}
      className={clsx(
        "w-full h-full p-5 hover:scale-105 hover:cursor-pointer transition-all",
        colors[difficulty],
        !active && _id !== challenge ? "opacity-25" : ""
      )}
    >
      <h2 className="font-bold">{task}</h2>
    </Card>
  );
};

export default ChallengeCard;
