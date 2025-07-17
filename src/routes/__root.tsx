import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TodosContextProvider from '../contexts/TodosContext/TodosContextProvider'
import ConfirmProvider from '../contexts/ConfirmContext/ConfirmContextProvider'
import AlertProvider from '../contexts/AlertContext/AlertContextProvider'
import GroupsContextProvider from '../contexts/GroupsContext/GroupsContextProvider'
import "../main.css";
import Sidebar from '../components/Sidebar'

export const Route = createRootRoute({
  component: () => (
    <>
      <GroupsContextProvider>
        <AlertProvider>
          <ConfirmProvider>
            <TodosContextProvider>
              <App />
            </TodosContextProvider>
          </ConfirmProvider>
        </AlertProvider>
      </GroupsContextProvider>
      <TanStackRouterDevtools />
    </>
  ),
})

function App() {
  return (
    <div id="app" className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div
        id="outlet"
        className="flex-grow min-w-0 overflow-y-auto scrollbar-thin"
      >
        <div
          id="outlet-inner"
          className="min-h-full w-full max-w-[1000px] mx-auto px-5 sm:px-10 py-10"
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}