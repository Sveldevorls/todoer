import EditorContextProvider from './EditorContext/EditorContextProvider'
import TodosContextProvider from './TodosContext/TodosContext'
import Home from './Home/Home'
import Editor from './Editor/Editor'
import './App.css'



export default function App() {
  return (
    <EditorContextProvider>
      <TodosContextProvider>
        <Home />
        <Editor />
      </TodosContextProvider>
    </EditorContextProvider>
  )
}