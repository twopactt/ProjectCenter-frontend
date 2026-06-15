import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserResponse,
} from '@/shared/types/user'
import api from './axios'

const extractError = (e: unknown): string =>
	(e as { response?: { data?: { error?: string } } })?.response?.data
		?.error || 'Неизвестная ошибка'

export const getUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await api.get<UserResponse[]>('/users')
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getUserById = async (id: number): Promise<UserResponse | null> => {
	try {
		const response = await api.get<UserResponse>(`/users/${id}`)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const getActiveUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await api.get<UserResponse[]>('/users/active')
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getGraduatedUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await api.get<UserResponse[]>('/users/graduated')
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}

export const createUser = async (
	data: CreateUserRequest,
): Promise<{ data: UserResponse } | { error: string }> => {
	try {
		const response = await api.post<UserResponse>('/users', data)
		return { data: response.data }
	} catch (e) {
		console.error(e)
		return { error: extractError(e) }
	}
}

export const updateUser = async (
	id: number,
	data: UpdateUserRequest,
): Promise<{ data: UserResponse } | { error: string }> => {
	try {
		const response = await api.put<UserResponse>(`/users/${id}`, data)
		return { data: response.data }
	} catch (e) {
		console.error(e)
		return { error: extractError(e) }
	}
}

export const deleteUser = async (id: number): Promise<boolean> => {
	try {
		await api.delete(`/users/${id}`)
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}
