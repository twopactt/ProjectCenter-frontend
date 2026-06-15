export interface UserResponse {
	id: number
	surname: string
	name: string
	patronymic: string
	login: string
	email: string
	phone: string
	role: string
	photo: string | null
	groupDisplayName: string | null
	curatorName: string | null
	dateEnrolled?: string
	dateGraduated?: string | null
}

export interface CreateUserRequest {
	role: string
	surname: string
	name: string
	patronymic: string
	login: string
	password: string
	phone: string
	email: string
	photo: string | null
	groupId: number
	teacherId: number
	dateEnrolled?: string
}

export interface UpdateUserRequest {
	surname: string
	name: string
	patronymic: string
	login: string
	email: string
	phone: string
	photoPath: string | null
	groupId: number
	curatorId: number
	dateEnrolled?: string
	dateGraduated?: string | null
}
