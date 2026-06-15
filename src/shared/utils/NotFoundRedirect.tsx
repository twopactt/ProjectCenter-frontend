import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundRedirect() {
	const navigate = useNavigate()

	useEffect(() => {
		if (window.history.length > 1) {
			navigate(-1)
		} else {
			navigate('/dashboard', { replace: true })
		}
	}, [navigate])

	return null
}
