export interface ProjectRequest {
	title: string
	studentName: string
	teacherName: string
	statusName: string
	typeName: string
	subjectName: string
	fileProject?: string | null
	fileDocumentation?: string | null
	isPublic: boolean
	dateDeadline: string
}

export interface ProjectResponse extends ProjectRequest {
	id: number
	createdDate: string
	comments: {
		userFullName: string
		text: string
		date: string
	}[]
}
