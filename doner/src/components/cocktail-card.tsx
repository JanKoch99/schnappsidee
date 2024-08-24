import { Drink } from "@/assets/drinks";
import React from "react";

const CocktailCard: React.FC<Drink & { active?: boolean }> = ({
  image,
  name,
  category,
  price,
}) => {
  return (
    <>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          alt={name}
          src={image}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <span>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </span>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{price.toFixed(2)}</p>
      </div>
    </>
  );
};

export default CocktailCard;
