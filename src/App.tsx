import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ColorModeProvider } from '@/components/ui/color-mode'
import SignIn from './pages/SignIn/SignIn'
import Dashboard from './pages/Dashboard/Dashboard'
import Projects from './pages/Projects/Projects'
import ProtectedRoute from './shared/utils/ProtectedRoute'

function App() {
	return (
		<ColorModeProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Navigate to={'/login'} />} />
					<Route path='/login' element={<SignIn />} />

					<Route
						path='/projects'
						element={
							<ProtectedRoute roles={['Student', 'Teacher', 'Admin']}>
								<Projects />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/dashboard'
						element={
							<ProtectedRoute roles={['Admin']}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</ColorModeProvider>
	)
}

export default App
