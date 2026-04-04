import { getRole, getToken, logout, validateToken } from '@/services/auth'
import type { JSX } from '@emotion/react/jsx-runtime'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
	children: JSX.Element
	roles?: string[]
}

function ProtectedRoute({ children, roles }: Props) {
	const [isValidating, setIsValidating] = useState(true)
	const [isValid, setIsValid] = useState(false)

	useEffect(() => {
		const checkToken = async () => {
			const token = getToken()

			if (!token) {
				logout()
				setIsValid(false)
				setIsValidating(false)
				return
			}

			const valid = await validateToken()
			setIsValid(valid)
			setIsValidating(false)
		}

		checkToken()
	}, [])

	if (isValidating) {
		return <div>Загрузка...</div>
	}

	const token = getToken()
	const userRole = getRole()

	if (!token || !isValid) {
		logout()
		return <Navigate to={'/login'} replace />
	}

	if (roles && !roles.includes(userRole!)) {
		return <Navigate to={'/dashboard'} replace />
	}

	return children
}

export default ProtectedRoute
