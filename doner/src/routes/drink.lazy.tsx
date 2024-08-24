import drinks, { type Drink } from "@/assets/drinks";
import CocktailCard from "@/components/cocktail-card";
import { useDonationStore } from "@/stores/donation";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/drink")({
  component: Drink,
});

function Drink() {
  const navigate = useNavigate();
  const { victim, drink, setDrink } = useDonationStore();
  if (!victim.name || !victim.email) {
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Choose the poison!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Select a drink to send to {victim.name}.
        </p>
      </div>
      <div className="m-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
        {drinks.map((d: Drink, index) => (
          <div
            key={index}
            className="group relative"
            onClick={() => {
              setDrink({
                name: d.name,
                price: d.price,
              });
              navigate({ to: "/challenge" });
            }}
          >
            <CocktailCard active={drink.name === d.name} {...d} />
          </div>
        ))}
      </div>
    </div>
  );
}
