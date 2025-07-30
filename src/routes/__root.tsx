import { useEffect, useRef, useState } from 'react'
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
  const outletRef = useRef<HTMLDivElement>(null)
  const prevWidth = useRef<number>(window.innerWidth);
  const location = useLocation();
  const breakpoint = 768; //md:

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const isWide = width >= breakpoint;
      const wasNarrow = prevWidth.current < breakpoint;
      const wasWide = prevWidth.current >= breakpoint;

      if (isWide && wasNarrow) {
        setSidebarIsOpen(true);
      } else if (!isWide && wasWide) {
        setSidebarIsOpen(false);
      }

      prevWidth.current = width;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarIsOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    // auto scroll to page top on path change
    outletRef.current!.scrollTop = 0;
  }, [location.pathname])

  return (
    <div id="app" className="flex h-screen w-screen overflow-hidden">
      <Sidebar sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
      <div id="outlet" className="relative flex-grow min-w-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-gutter:stable]" ref={outletRef}>
        <div id="header" className={`flex sticky top-0 z-2 h-14
          ${!sidebarIsOpen && "[&>header]:pl-6"}
          `}></div>
        <div id="content" className="mx-auto max-w-[1000px] px-10 pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}