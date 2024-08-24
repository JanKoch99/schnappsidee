import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { config } from "@/Constants.js.ts";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { type Moment } from "moment";
import { useState } from "react";
import { z } from "zod";
import { CreateDonationRequestBodySchema } from "./payment.lazy";
const URL: string = config.url;

export const Route = createFileRoute("/feed/$id")({
  component: FeedRoute,
});

type TimelineEvent = {
  _id: string;
  text: string;
  date: Moment;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  background: "bg-green-500" | "bg-blue-500";
} & z.infer<typeof CreateDonationRequestBodySchema>;

function FeedRoute() {
  const { id } = Route.useParams<{ id: string }>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  //TODO: Michael please help ! ! ! or else . . .
  const eventSource = new EventSource(`${URL}/events/${id}`);
  eventSource.onmessage = function (event) {
    const newDonation = JSON.parse(event.data);
    console.log(newDonation);
    setTimeline((timeline) => [...timeline, newDonation]);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Thanks for spreading the cheers!
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Your donation has been sent. Keep spreading the cheers! {id}
        </p>
      </div>

      <Card className="m-10 items-center justify-center gap-x-6">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {timeline.map((event, eventIdx) => (
                <li key={event._id}>
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
                          <p className="text-sm text-gray-500">{event.text} </p>
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
      </Card>
    </div>
  );
}
