import axios from 'axios'
import config from './config'

interface LoginRequest {
	login: string
	password: string
}

interface LoginResponse {
	token: string
	role: string
	fullName: string
}

export const login = async (
	data: LoginRequest
): Promise<LoginResponse | null> => {
	try {
		const response = await axios.post(`${config.api.baseUrl}/auth/login`, data)

		const { token, role, fullName } = response.data

		localStorage.setItem('token', token)
		localStorage.setItem('role', role)
		localStorage.setItem('fullName', fullName)

		return response.data
	} catch (e) {
		console.error(e)

		return null
	}
}

export const logout = () => {
	localStorage.removeItem('token')
	sessionStorage.removeItem('token')
	localStorage.removeItem('role')
	localStorage.removeItem('fullName')

	window.location.href = '/login'
}

export const getToken = () => localStorage.getItem('token')
export const getRole = () => localStorage.getItem('role')
