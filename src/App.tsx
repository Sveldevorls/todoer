import TodosContextProvider from './TodosContext/TodosContextProvider'
import { ConfirmProvider } from './ConfirmContext/ConfirmContextProvider'
import Home from './Home/Home'
import './App.css'
import AlertProvider from './AlertContext/AlertContextProvider'


export default function App() {
  return (
    <AlertProvider>
      <ConfirmProvider>
        <TodosContextProvider>
          <Home />
        </TodosContextProvider>
      </ConfirmProvider>
    </AlertProvider>
  )
}