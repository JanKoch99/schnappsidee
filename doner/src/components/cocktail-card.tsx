import { Drink } from "@/assets/drinks";
import { Card } from "@/components/ui/card";
import { useDonationStore } from "@/stores/donation";
import React from "react";

const CocktailCard: React.FC<Drink & { active?: boolean }> = ({
  image,
  name,
  description,
  price,
  active,
}) => {
  const { setDrink, drink } = useDonationStore();
  return (
    <Card className={!active && drink ? "opacity-25" : ""}>
      <div className="flex cursor-pointer" onClick={() => setDrink(name)}>
        <img
          draggable={false}
          src={image}
          className={
            "h-24 w-auto object-cover transition-all hover:scale-105 aspect-square rounded-l-xl"
          }
        />
        <div className="flex flex-col px-2 py-3 overflow-hidden">
          <h2 className="font-bold truncate">{name}</h2>
          <p className="truncate">{description}</p>
          CHF {price.toFixed(2)}
        </div>
      </div>
    </Card>
  );
};

export default CocktailCard;
