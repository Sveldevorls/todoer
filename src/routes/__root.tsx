import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TodosContextProvider from '../contexts/TodosContext/TodosContextProvider'
import ConfirmProvider from '../contexts/ConfirmContext/ConfirmContextProvider'
import AlertProvider from '../contexts/AlertContext/AlertContextProvider'
import Menu from '../components/Menu'
import "../main.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <AlertProvider>
        <ConfirmProvider>
          <TodosContextProvider>
            <App />
          </TodosContextProvider>
        </ConfirmProvider>
      </AlertProvider>
      <TanStackRouterDevtools />
    </>
  ),
})

function App() {
  return (
    <div id="app" className='flex min-h-[100vh]'>
      <Menu />
      <div id="outlet" className="flex flex-grow shrink p-10">
        <div className="w-full max-w-[1000px] mx-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  )
}