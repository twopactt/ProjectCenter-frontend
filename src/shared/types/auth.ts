export interface LoginRequest {
	login: string
	password: string
}

export interface ProfileResponse {
	id: number
	surname: string
	name: string
	patronymic?: string
	login: string
	email: string
	phone: string
	role: string
	groupDisplayName?: string
	curatorName?: string
	photo: string | null
}
