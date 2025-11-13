import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ColorModeProvider } from '@/components/ui/color-mode'
import SignIn from './pages/SignIn/SignIn'
import Dashboard from './pages/Dashboard/Dashboard'
import Projects from './pages/Projects/Projects'

function App() {
	return (
		<ColorModeProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Navigate to={'/login'} />} />
					<Route path='/login' element={<SignIn />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/projects' element={<Projects />} />
				</Routes>
			</BrowserRouter>
		</ColorModeProvider>
	)
}

export default App
