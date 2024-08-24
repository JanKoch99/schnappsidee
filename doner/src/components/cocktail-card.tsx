import { Drink } from "@/assets/drinks";
import { Card } from "@/components/ui/card";
import React from "react";

const CocktailCard: React.FC<Drink> = ({ image, name, description, price }) => {
  return (
    <Card>
      <div className="flex cursor-pointer">
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
