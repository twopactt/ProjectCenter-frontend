import axios from 'axios'
import config from './config'

interface LoginRequest {
	login: string
	password: string
}

interface ProfileResponse {
	id: number
	surname: string
	name: string
	patronymic: string
	login: string
	email: string
	phone: string
	role: string
	photo: string
	groupName: string
	curatorName: string
}

export const login = async (
	data: LoginRequest
): Promise<ProfileResponse | null> => {
	try {
		const response = await axios.post(`${config.api.baseUrl}/auth/login`, data)

		const { token, role, fullName } = response.data

		localStorage.setItem('token', token)
		localStorage.setItem('role', role)
		localStorage.setItem('fullName', fullName)

		const profile = await axios.get(`${config.api.baseUrl}/Profile`, {
			headers: { Authorization: `Bearer ${token}` },
		})

		localStorage.setItem('profile', JSON.stringify(profile.data))

		return profile.data
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

export const getProfile = (): ProfileResponse | null => {
	const data = localStorage.getItem('profile')
	return data ? JSON.parse(data) : null
}
