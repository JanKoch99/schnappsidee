import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createLazyFileRoute("/payment")({
  component: PaymentRoute,
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

function PaymentRoute() {
  const { perpetrator, victim, drink, challenge } = useDonationStore();
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
    <div className="mx-auto max-w-2xl text-center">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Time to pay!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Did you really think we would let you get away with it for free?
        </p>
      </div>

      <Card className="m-10 items-center justify-center gap-x-6">
        <CardHeader></CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
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
        </CardContent>
      </Card>
    </div>
  );
}
