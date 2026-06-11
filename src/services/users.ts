import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserResponse,
} from '@/shared/types/user'
import api from './axios'

export const getUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await api.get<UserResponse[]>('/users')
		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
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
): Promise<UserResponse | null> => {
	try {
		const response = await api.post<UserResponse>('/users', data)
		return response.data
	} catch (e) {
		console.error(e)
		return null
	}
}

export const updateUser = async (
	id: number,
	data: UpdateUserRequest,
): Promise<UserResponse | null> => {
	try {
		const response = await api.put<UserResponse>(`/users/${id}`, data)
		return response.data
	} catch (e) {
		console.error(e)
		return null
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
