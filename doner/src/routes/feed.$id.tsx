import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { config } from "@/Constants.js.ts";
import { useDonationStore } from "@/stores/donation";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import moment, { type Moment } from "moment";
import { useEffect, useState } from "react";
const URL: string = config.url;

export const Route = createFileRoute("/feed/$id")({
  component: FeedRoute,
});

type TimelineEvent = {
  _id: string;
  text: string;
  date: Moment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  background: "bg-green-500" | "bg-blue-500" | "bg-yellow-500" | "bg-red-500";
  type: "open" | "inProgress" | "done" | "chicken";
};

function FeedRoute() {
  const { id } = Route.useParams<{ id: string }>();
  const { setVictim, setDrink, setChallenge, drink, victim } =
    useDonationStore();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      _id: "1",
      text: "The bar has received your donation offer.",
      date: moment(),
      icon: CheckCircledIcon,
      background: "bg-blue-500",
      type: "open",
    },
  ]);

  useEffect(() => {
    const eventSource = new EventSource(`${URL}/events/${id}`);
    eventSource.onmessage = function (event) {
      const newDonation = JSON.parse(event.data) as {
        createdAt: string;
        drink: string;
        perpetrator: string;
        victim: string;
        price: number;
        taskState: "done" | "inProgress" | "open" | "chicken";
        updatedAt: string;
      };

      let text: string;
      let background:
        | "bg-green-500"
        | "bg-blue-500"
        | "bg-yellow-500"
        | "bg-red-500";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let icon: any;
      switch (newDonation.taskState) {
        case "inProgress":
          text = `The bar has accepted your donation offer for ${drink.name}.`;
          background = "bg-yellow-500";
          icon = CheckCircledIcon;
          break;
        case "done":
          text = `${victim.name} rocked the challenge and received your donation offer for ${drink.name}.`;
          background = "bg-green-500";
          icon = CheckCircledIcon;
          break;
        case "chicken":
          text = `${victim.name} chickened out of the challenge and your donation offer for ${drink.name} was rejected.`;
          background = "bg-red-500";
          icon = CrossCircledIcon;
          break;
        case "open":
          background = "bg-blue-500";
          icon = CheckCircledIcon;
          text = `The bar has received your donation offer for ${drink.name}.`;
          break;
        default:
          text = `Oops, something went wrong with your donation offer for ${drink.name}.`;
          background = "bg-red-500";
          icon = CrossCircledIcon;
          break;
      }

      if (timeline.findIndex((e) => newDonation.taskState === e.type) === -1) {
        setTimeline((timeline) => [
          ...timeline,
          {
            _id: newDonation.drink + "-" + newDonation.updatedAt,
            text,
            date: moment(newDonation.updatedAt),
            icon,
            background,
            type: newDonation.taskState,
          },
        ]);
      }
    };
    return () => {
      eventSource.close();
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Thanks for spreading the cheers!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Your donation has been sent. Keep spreading the cheers!
          <br />
          <span className="font-mono text-sm">{id}</span>
        </p>
      </div>

      <Card className="m-10 items-center justify-center gap-x-6">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flow-root min-h-72">
            <ul role="list" className="-mb-8">
              {timeline.map((event, eventIdx) => (
                <li key={event._id + eventIdx}>
                  <div className="relative pb-8">
                    {eventIdx !== timeline.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={clsx(
                            event.background,
                            "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                          )}
                        >
                          <event.icon
                            aria-hidden="true"
                            className="h-5 w-5 text-white"
                          />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500 text-left">
                            {event.text}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time
                            dateTime={event.date.format("YYYY-MM-DD HH:mm:ss")}
                          >
                            {event.date.format("HH:mm")}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <hr />
          <Button
            onClick={() => {
              // reset forms
              setVictim({ name: "", email: "" });
              setDrink({ name: "", price: 0 });
              setChallenge("null");

              navigate({ to: "/" });
            }}
          >
            Send another one! 🍹
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
