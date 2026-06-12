export interface StudentRequest {
	surname: string
	name: string
	patronymic?: string | null
}


export interface StudentResponse extends StudentRequest {
	id: number
}
