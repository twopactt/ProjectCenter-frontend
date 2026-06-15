export interface TeacherRequest {
	surname: string
	name: string
	patronymic?: string | null
}


export interface TeacherResponse extends TeacherRequest {
	id: number
}
