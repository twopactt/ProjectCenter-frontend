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

export interface ProjectUI {
	id: number
	title: string
	studentName: string
	teacherName: string
	statusName: string
	typeName: string
	subjectName: string
	isPublic: boolean
	dateDeadline: Date
	createdDate: Date
	comments: ProjectComment[]
}

export interface ProjectComment {
	userFullName: string
	text: string
	date: Date
}
