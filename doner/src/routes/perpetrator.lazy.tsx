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
import { PersonSchema, useDonationStore } from "@/stores/donation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/perpetrator")({
  component: PerpetratorRoute,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreateDonationRequestBodySchema = z.object({
  victim: z.string().email(),
  challengeID: z.string().length(24),
  drink: z.string().min(3),
  perpetrator: z.string(),
  contactInfo: z.string().email(),
  taskState: z.enum(["open"]),
  victimName: z.string().min(3),
});

function PerpetratorRoute() {
  const { setPerpetrator, perpetrator, victim, drink, challenge } =
    useDonationStore();
  const form = useForm<z.infer<typeof PersonSchema>>({
    resolver: zodResolver(PersonSchema),
    defaultValues: {
      name: perpetrator.name,
      email: perpetrator.email,
    },
  });

  const mutation = useMutation({
    mutationFn: (donation: z.infer<typeof CreateDonationRequestBodySchema>) => {
      return axios.post("/donations", donation);
    },
  });

  if (mutation.isPending) {
    return <span>Submitting...</span>;
  }

  if (mutation.isSuccess) {
    return <span>Submitted!</span>;
  }

  if (mutation.isError) {
    return <span>Error: {mutation.error.message}</span>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          setPerpetrator(values);

          mutation.mutate({
            drink,
            challengeID: challenge,
            contactInfo: values.email,
            perpetrator: values.name,
            taskState: "open",
            victim: victim.email,
            victimName: victim.name,
          });
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
              <FormDescription>E-Mail of perpetrator.</FormDescription>
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
              <FormDescription>Name of perpetrator.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
