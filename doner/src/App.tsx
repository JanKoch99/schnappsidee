import drinks, { Drink } from "@/assets/drinks";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CocktailCard from "./components/cocktail-card";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import challenges, { Challenge } from "./assets/challenges";
import ChallengeCard from "./components/challenge-card";

const FormSchema = z.object({
  toPhone: z
    .string()
    .regex(
      /(\b(0041)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/,
      {
        message: "Phone number must be valid!",
      }
    ),
  toName: z.string().regex(/^[a-zA-Z\s.]{3,}$/, {
    message: "Are you kidding me? That's the name?",
  }),
  anonymous: z.boolean(),
});

export default function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      toPhone: "+41 79 123 45 67",
      toName: faker.person.fullName(),
      anonymous: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="p-5 md:p-10 flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="toPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input autoComplete="tel" {...field} />
                </FormControl>
                <FormDescription>Phone number of victim.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toName"
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

          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">Drinks</h1>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselPrevious />
                <CarouselContent>
                  {drinks.map((drink: Drink, index) => (
                    <CarouselItem className="md:basis-1/2 lg:basis-1/4 xl:basis-1/6">
                      <CocktailCard key={index} {...drink} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
            {challenges
              .sort((a, b) => a.difficulty - b.difficulty)
              .map((challenge: Challenge, index) => (
                <ChallengeCard key={index} {...challenge} />
              ))}
          </div>

          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    className="w-6 h-6"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Anonymous</FormLabel>
                  <FormDescription>
                    Do you want to stay anonymous?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
