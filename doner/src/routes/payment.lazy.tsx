import twint from "@/assets/logo-twint.png";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PersonSchema, useDonationStore } from "@/stores/donation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { config } from "@/Constants.js.ts";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createLazyFileRoute("/payment")({
  component: PaymentRoute,
});

export const CreateDonationRequestBodySchema = z.object({
  victim: z.string().email(),
  challengeID: z.string().length(24),
  drink: z.string().min(3),
  perpetrator: z.string(),
  contactInfo: z.string().email(),
  taskState: z.enum(["open"]),
  victimName: z.string().min(3),
  price: z.number().positive(),
});

const URL: string = config.url;
function PaymentRoute() {
  const navigate = useNavigate();
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
      return axios.post(`${URL}/api/donations`, donation);
    },
  });

  if (mutation.isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (mutation.isSuccess) {
    navigate({ to: "/feed" });
  }

  if (mutation.isError) {
    return (
      <div className="mx-auto max-w-2xl text-center mt-24">
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      </div>
    );
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
                  drink: drink.name,
                  challengeID: challenge,
                  contactInfo: values.email,
                  perpetrator: values.name,
                  taskState: "open",
                  victim: victim.email,
                  victimName: victim.name,
                  price: drink.price,
                });
              })}
              className="w-full space-y-6"
            >
              <img src={twint} alt="" className="mx-auto -my-4 max-w-[250px]" />

              <div className="bg-black text-white text-4xl font-semibold py-6">
                CHF {drink.price.toFixed(2)}
              </div>

              <Button type="submit" className="bg-black w-full">
                Open TWINT App
              </Button>

              <hr />

              <p>Enter the code in your TWINT app:</p>

              <div className="w-full flex gap-2 items-stretch justify-stretch">
                {[0, 1, 5, 3, 8].map((i) => (
                  <div
                    className="bg-gray-300 px-4 py-5 text-2xl flex-1"
                    key={i}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
