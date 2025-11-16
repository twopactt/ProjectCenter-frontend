import { getRole, getToken, logout } from '@/services/auth'
import type { JSX } from '@emotion/react/jsx-runtime'
import { Navigate } from 'react-router-dom'

interface Props {
	children: JSX.Element
	roles?: string[]
}

function ProtectedRoute({ children, roles }: Props) {
	const token = getToken()
	const userRole = getRole()

	if (!token) {
		logout()
		return <Navigate to={'/login'} replace />
	}

	if (roles && !roles.includes(userRole!)) {
		return <Navigate to={'/projects'} replace />
	}

	return children
}

export default ProtectedRoute
