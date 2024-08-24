import { CheckIcon } from "@radix-ui/react-icons";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import clsx from "clsx";

export const Route = createRootRoute({
  component: Root,
});

export default function Root() {
  const steps = [
    { id: "Step 1", name: "Victim", href: "/", status: "complete" },
    { id: "Step 2", name: "Drink", href: "#", status: "current" },
    { id: "Step 3", name: "Challenge", href: "#", status: "upcoming" },
    { id: "Step 4", name: "Payment", href: "#", status: "upcoming" },
    { id: "Step 5", name: "Confirmation", href: "#", status: "upcoming" },
  ];

  return (
    <div className="h-full flex flex-col gap-10">
      <nav
        aria-label="Progress"
        className="w-full py-5 border-b-2 border-gray-300 fixed bg-white"
      >
        <ol role="list" className="flex items-center justify-center w-full">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={clsx(
                stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                "relative"
              )}
            >
              {step.status === "complete" ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="h-0.5 w-full bg-blue-600" />
                  </div>
                  <Link
                    to={step.href}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-900"
                  >
                    <CheckIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                    />
                    <span className="sr-only">{step.name}</span>
                  </Link>
                </>
              ) : step.status === "current" ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <span
                    aria-current="step"
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full bg-blue-600"
                    />
                    <span className="sr-only">{step.name}</span>
                  </span>
                </>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <span className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    />
                    <span className="sr-only">{step.name}</span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="px-5 mt-24">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  );
}
