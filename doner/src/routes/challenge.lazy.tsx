import ChallengeCard from "@/components/challenge-card";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Slider } from "@/components/ui/slider";
import { useDonationStore } from "@/stores/donation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { QueryFunction, useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {config} from "@/Constants.js.ts";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

const URL: string = config.url;
export const Route = createLazyFileRoute("/challenge")({
  component: ChallengeRoute,
});

export type Challenge = {
  _id: string;
  task: string;
  difficulty: 0 | 1 | 2;
  createdAt: string;
  updatedAt: string;
};

const ChallengeRequestBodySchema = z.object({
  task: z.string().min(3).max(100),
  difficulty: z.number().int().min(0).max(2),
});

const fetchChallenges: QueryFunction<Challenge[], string[], never> = () =>
  axios
    .get(`${URL}/api/challenges/`)
    // add a delay to simulate network latency
    .then(
      (response) =>
        new Promise((resolve) => setTimeout(() => resolve(response.data), 1000))
    );

function ChallengeRoute() {
  const navigate = useNavigate();
  const { victim, drink } = useDonationStore();
  if (!victim.name || !victim.email) {
    navigate({ to: "/" });
  }

  const form = useForm<z.infer<typeof ChallengeRequestBodySchema>>({
    resolver: zodResolver(ChallengeRequestBodySchema),
    defaultValues: {
      task: "",
      difficulty: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (challenge: z.infer<typeof ChallengeRequestBodySchema>) => {
      return axios.post(`${URL}/api/challenges/`, challenge);
    },
  });

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  if (mutation.isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (mutation.isSuccess) {
    navigate({ to: "/perpetrator" });
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

  if (isPending) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl text-center mt-24">
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="mx-auto max-w-2xl text-center">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose the challenge!
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            If <span className="font-bold">{victim.name}</span> completes the
            challenge, you will donate a{" "}
            <span className="font-bold">{drink.name}</span>.
          </p>
        </div>
        <div className="mx-12 grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2 xl:gap-x-8">
          {data
            .sort((a, b) => a.difficulty - b.difficulty)
            .map((challenge: Challenge, index: number) => (
              <ChallengeCard key={index} {...challenge} />
            ))}
        </div>
        <Card className="mt-12 max-w-2xl mx-6">
          <CardHeader>Custom</CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit((values) => {
                mutation.mutate({
                  task: values.task,
                  difficulty: values.difficulty,
                });
              })}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        Easy
                        <Slider max={2} step={1} defaultValue={[field.value]} />
                        Hard
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
