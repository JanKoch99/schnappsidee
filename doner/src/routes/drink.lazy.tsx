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
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl text-center">Choose a drink</h1>
      <p className="text-center">
        Pick the perfect drink to send{" "}
        <span className="font-bold text-blue-500">{victim.name}</span> a
        delightful surprise!
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {drinks.map((d: Drink, index) => (
          <div
            key={index}
            className="group relative"
            onClick={() => {
              setDrink(d.name);
              navigate({ to: "/challenge" });
            }}
          >
            <CocktailCard active={drink === d.name} {...d} />
          </div>
        ))}
      </div>
    </div>
  );
}
