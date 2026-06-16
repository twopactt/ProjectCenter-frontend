import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ColorModeProvider } from '@/components/ui/color-mode'
import { Toaster } from '@/components/ui/toaster'
import WelcomePage from './pages/Welcome/WelcomePage'
import SignInPage from './pages/SignIn/SignInPage'
import ProtectedRoute from './shared/utils/ProtectedRoute'
import { routes, type RoutesGroup } from '@/shared/utils/routes'
import NotFoundRedirect from './shared/utils/NotFoundRedirect'

function App() {
	return (
		<ColorModeProvider>
			<Toaster />
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<WelcomePage />} />
					<Route path='/login' element={<SignInPage />} />
					{routes.map((group: RoutesGroup) =>
						group.items.map(item => (
							<Route
								key={item.path}
								path={item.path}
								element={
									<ProtectedRoute roles={group.roles}>
										{item.element}
									</ProtectedRoute>
								}
							/>
						)),
					)}
					<Route path='*' element={<NotFoundRedirect />} />
				</Routes>
			</BrowserRouter>
		</ColorModeProvider>
	)
}

export default App
