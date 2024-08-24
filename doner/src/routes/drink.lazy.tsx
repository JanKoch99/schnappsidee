import drinks, { type Drink } from "@/assets/drinks";
import CocktailCard from "@/components/cocktail-card";
import { useDonationStore } from "@/stores/donation";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/drink")({
  component: Drink,
});

function Drink() {
  const navigate = useNavigate();
  const { victim, drink } = useDonationStore();
  if (!victim.name || !victim.email) {
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-6">
      Your victim is {victim.name} and their email is {victim.email}. What drink would you like to donate?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {drinks.map((d: Drink, index) => (
          <CocktailCard active={drink === d.name} key={index} {...d} />
        ))}
      </div>
    </div>
  );
}
