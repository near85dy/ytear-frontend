import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { NotificationProvider } from './shared/NotificationProvider'

function App() {
  return (
    <>
      <NotificationProvider>
          <RouterProvider router={router}></RouterProvider>
      </NotificationProvider>    
    </>
  )
}

export default App
