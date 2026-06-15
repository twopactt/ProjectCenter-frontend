export interface PasswordResetResponse {
	success: boolean
	message: string
	resetToken: string | null
}
