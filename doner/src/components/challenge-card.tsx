import { Card } from "@/components/ui/card";
import { Challenge } from "@/routes/challenge.lazy";
import { useDonationStore } from "@/stores/donation";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import React from "react";

const ChallengeCard: React.FC<Challenge> = ({ _id, task, difficulty }) => {
  const navigate = useNavigate();
  const { setChallenge } = useDonationStore();

  const colors = {
    2: "bg-red-100 border-2 border-red-500",
    0: "bg-green-100 border-2 border-green-500",
    1: "bg-yellow-100 border-2 border-yellow-500",
  };

  return (
    <Card
      onClick={() => {
        setChallenge(_id);
        navigate({ to: "/perpetrator" });
      }}
      className={clsx(
        "w-full h-full p-5 hover:cursor-pointer transition-all",
        colors[difficulty]
      )}
    >
      <h2 className="font-bold">{task}</h2>
    </Card>
  );
};

export default ChallengeCard;
