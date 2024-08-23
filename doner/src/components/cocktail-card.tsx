import { Drink } from "@/assets/drinks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";

const CocktailCard: React.FC<Drink> = ({ image, name, description, price }) => {
  return (
    <Card>
      <CardHeader className="overflow-hidden rounded-md pt-0 px-0">
        <img
          draggable={false}
          src={image}
          className={
            "h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"
          }
        />
      </CardHeader>
      <CardContent>
        <h2 className="font-bold truncate">{name}</h2>
        <p className="truncate">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">CHF {price.toFixed(2)}</Button>
      </CardFooter>
    </Card>
  );
};

export default CocktailCard;
