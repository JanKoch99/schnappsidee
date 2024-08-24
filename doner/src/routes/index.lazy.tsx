import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDonationStore, VictimSchema } from "@/stores/donation";
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
  const form = useForm<z.infer<typeof VictimSchema>>({
    resolver: zodResolver(VictimSchema),
    defaultValues: {
      name: victim.name,
      email: victim.email,
    },
  });

  return (
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
              <FormDescription>E-Mail of victim.</FormDescription>
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
              <FormDescription>Name of victim.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
