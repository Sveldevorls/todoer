import { useRef, useEffect, useState } from 'react'
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import ConfirmProvider from '../contexts/ConfirmContext/ConfirmContextProvider'
import AlertProvider from '../contexts/AlertContext/AlertContextProvider'
import Sidebar from '../components/Sidebar'
import "../main.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <AlertProvider>
        <ConfirmProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </ConfirmProvider>
      </AlertProvider>
      <TanStackRouterDevtools />
    </>
  ),
})

function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(window.innerWidth >= 768);
  const outletRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // auto scroll to page top on path change
  useEffect(() => {
    outletRef.current!.scrollTop = 0;
  }, [location.pathname])

  return (
    <div
      id="app"
      className="flex h-screen w-screen overflow-hidden"
    >
      <div
        id="sidebar"
        className={`absolute md:relative transition-[margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-2
          ${sidebarIsOpen ? "ml-0" : "-ml-[260px]"}
        `}
      >
        <Sidebar sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
        <div
          className={`fixed inset-0 md:hidden bg-black/50 transition-all
            ${sidebarIsOpen ? "opacity-100" : "opacity-0"}
            ${sidebarIsOpen ? "pointer-events-auto" : "pointer-events-none"}
          `}
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        >
        </div>
      </div>
      <div
        id="outlet"
        className="relative flex-grow min-w-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-gutter:stable]"
        ref={outletRef}
      >
        <div
          id="header"
          className={`sticky top-0 h-14 z-1
            ${sidebarIsOpen ? "[&>header]:px-4" : "[&>header]:pl-12 [&>header]:pr-4"}
          `}
        >
        </div>
        <div id="content" className="mx-auto max-w-[1000px] px-10 pb-10">
          <Outlet />
        </div>
      </div>
      <div id="overlay" className="z-100"></div>
    </div>
  )
}