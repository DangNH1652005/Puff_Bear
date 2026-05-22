import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>

      <Toaster position="top-right"
        reverseOrder={false} />
    </>
  )
}

export default App
