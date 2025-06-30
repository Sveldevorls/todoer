import TodosContextProvider from './TodosContext/TodosContext'
import Home from './Home/Home'
import './App.css'

export default function App() {
  return (
    <TodosContextProvider>
      <Home />
    </TodosContextProvider>
  )
}