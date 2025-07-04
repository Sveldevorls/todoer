import TodosContextProvider from './TodosContext/TodosContextProvider'
import { ConfirmProvider } from './ConfirmContext/ConfirmContextProvider'
import Home from './Home/Home'
import './App.css'



export default function App() {
  return (
    <ConfirmProvider>
        <TodosContextProvider>
          <Home />
        </TodosContextProvider>
    </ConfirmProvider>
  )
}