import { Challenge } from "@/assets/challenges";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import React from "react";

const ChallengeCard: React.FC<Challenge> = ({
  name,
  description,
  difficulty,
}) => {
  const colors = {
    2: "bg-red-100 border-2 border-red-500",
    0: "bg-green-100 border-2 border-green-500",
    1: "bg-yellow-100 border-2 border-yellow-500",
  };

  return (
    <Card
      className={clsx(
        "w-full h-full p-5 hover:scale-105 hover:cursor-pointer transition-all",
        colors[difficulty]
      )}
    >
      <h2 className="font-bold">{name}</h2>
      <p>{description}</p>
    </Card>
  );
};

export default ChallengeCard;
