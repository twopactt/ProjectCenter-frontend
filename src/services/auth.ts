import axios from 'axios'
import api from './axios'
import type { LoginRequest, ProfileResponse } from '@/shared/types/auth'
import { getPhotoUrl } from './utils'

export const decodeToken = (token: string): Record<string, unknown> | null => {
	try {
		const payload = token.split('.')[1]
		return JSON.parse(atob(payload))
	} catch {
		return null
	}
}

export const login = async (
	data: LoginRequest,
): Promise<ProfileResponse | null> => {
	try {
		const response = await api.post(`/auth/login`, data)

		const { token } = response.data

		localStorage.setItem('token', token)

		const profile = await api.get(`/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		})

		const normalized = {
			...profile.data,
			photo: getPhotoUrl(profile.data.photo),
		}

		return normalized
	} catch (e) {
		console.error(e)
		return null
	}
}

export const logout = () => {
	localStorage.removeItem('token')

	window.location.href = '/login'
}

export const getToken = () => localStorage.getItem('token')

export const getRole = (): string | null => {
	const token = getToken()
	if (!token) return null

	const payload = decodeToken(token)
	if (!payload) return null

	const role = payload.role as string | undefined
	if (role) return role

	return (
		(payload[
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
		] as string | undefined) ?? null
	)
}

export const validateToken = async (): Promise<boolean> => {
	const token = getToken()
	if (!token) return false

	try {
		await api.get(`/profile`)
		return true
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 401) {
				logout()
				return false
			}
		}
		return false
	}
}
