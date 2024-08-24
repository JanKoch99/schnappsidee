import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

export default function Root() {
  return (
    <div className="h-full flex flex-col gap-10">
      <div className="p-4">
        <div className="w-full bg-gray-300 rounded-lg overflow-hidden h-12 m-4">
          <div className="flex items-center h-full">
            <div className="beer-fill">
              <div className="bubbles bubble-1"></div>
              <div className="bubbles bubble-2"></div>
              <div className="bubbles bubble-3"></div>
              <div className="bubbles bubble-4"></div>
            </div>

            <div className="beer-icon-container">
              <span className="beer-icon">🍺</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-24">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  );
}
