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
      <div id="outlet" className="flex-grow-1 shrink-0">
        <Outlet />
      </div>
    </div>
  )
}