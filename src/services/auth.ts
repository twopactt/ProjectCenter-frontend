import axios from 'axios'
import config from './config'
import type { LoginRequest, ProfileResponse } from '@/shared/types/auth'
import { getPhotoUrl } from './utils'

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

		const normalized = {
			...profile.data,
			photo: getPhotoUrl(profile.data.photo),
		}

		localStorage.setItem('profile', JSON.stringify(normalized))

		return normalized
	} catch (e) {
		console.error(e)
		return null
	}
}

export const logout = () => {
	localStorage.removeItem('token')
	localStorage.removeItem('role')
	localStorage.removeItem('fullName')
	localStorage.removeItem('profile')

	window.location.href = '/login'
}

export const getToken = () => localStorage.getItem('token')
export const getRole = () => localStorage.getItem('role')

export const getProfile = (): ProfileResponse | null => {
	const data = localStorage.getItem('profile')
	if (!data) return null

	try {
		const profile = JSON.parse(data) as ProfileResponse
		return profile
	} catch {
		return null
	}
}
