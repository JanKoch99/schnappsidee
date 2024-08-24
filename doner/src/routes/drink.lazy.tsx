import drinks, { type Drink } from "@/assets/drinks";
import CocktailCard from "@/components/cocktail-card";
import { useDonationStore } from "@/stores/donation";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/drink")({
  component: Drink,
});

function Drink() {
  const navigate = useNavigate();
  const { name, phone } = useDonationStore();
  if (!name || !phone) {
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-6">
      Your victim is {name} and their phone number is {phone}.
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {drinks.map((drink: Drink, index) => (
          <Link to="/challenge">
            <CocktailCard key={index} {...drink} />
          </Link>
        ))}
      </div>
    </div>
  );
}
