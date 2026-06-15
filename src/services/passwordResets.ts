import api from './axios'
import axios from 'axios'
import type { PasswordResetResponse } from '@/shared/types/passwordReset'

const handleRequest = async (
	url: string,
	data: Record<string, unknown>,
): Promise<PasswordResetResponse> => {
	try {
		const response = await api.post(url, data)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data as PasswordResetResponse
		}
		return { success: false, message: 'Ошибка сети', resetToken: null }
	}
}

export const forgotPassword = async (
	email: string,
): Promise<PasswordResetResponse> => {
	return handleRequest(`/passwordReset/forgot`, { email })
}

export const verifyCode = async (
	email: string,
	code: string,
): Promise<PasswordResetResponse> => {
	return handleRequest(`/passwordReset/verify`, { email, code })
}

export const resetPassword = async (
	email: string,
	code: string,
	newPassword: string,
	confirmPassword: string,
): Promise<PasswordResetResponse> => {
	return handleRequest(`/passwordReset/reset`, {
		email,
		code,
		newPassword,
		confirmPassword,
	})
}
