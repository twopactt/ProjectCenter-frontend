import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ColorModeProvider } from '@/components/ui/color-mode'
import SignInPage from './pages/SignIn/SignInPage'
import ProjectsPage from './pages/Projects/ProjectsPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ProtectedRoute from './shared/utils/ProtectedRoute'

function App() {
	return (
		<ColorModeProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Navigate to={'/login'} />} />
					<Route path='/login' element={<SignInPage />} />

					<Route
						path='/projects'
						element={
							<ProtectedRoute roles={['Student', 'Teacher', 'Admin']}>
								<ProjectsPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/dashboard'
						element={
							<ProtectedRoute roles={['Admin']}>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</ColorModeProvider>
	)
}

export default App
