import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonSchema, useDonationStore } from "@/stores/donation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createLazyFileRoute("/")({
  component: VictimForm,
});

function VictimForm() {
  const navigate = useNavigate();
  const { setVictim, victim } = useDonationStore();
  const form = useForm<z.infer<typeof PersonSchema>>({
    resolver: zodResolver(PersonSchema),
    defaultValues: {
      name: victim.name,
      email: victim.email,
    },
  });

  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="text-5xl mb-2">🍹</span>
            <br />
            Spread the Cheers!
            <br />
            Send a Drink, Even When You're Not Near.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Enter your victims's name and make their day brighter with a drink
            on you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  setVictim(values);
                  navigate({ to: "/drink" });
                })}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <Input autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Hold my 🍺</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
