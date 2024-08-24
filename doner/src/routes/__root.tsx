import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Create a client
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: Root,
});

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full flex flex-col gap-10">
        {/* <div className="p-4">
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
        </div> */}

        <svg
          className="wave absolute -z-10 w-full left-0 top-[30%]"
          viewBox="0 0 12960 1120"
        >
          <path d="M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z">
            <animate
              dur="5s"
              repeatCount="indefinite"
              attributeName="d"
              values="
              M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z;
              M9720,0C8100,0,8100,319,6480,319S4860,0,3240,0,1620,320,0,320v800H12960V320C11340,320,11340,0,9720,0Z;
              M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z
            "
            />
          </path>
        </svg>
        <div className="bg-[#f1c40f] -z-10 absolute beer h-full w-full">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>

        <div className="overflow-x-hidden overflow-y-auto h-screen">
          <Outlet />
        </div>

        <TanStackRouterDevtools />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
