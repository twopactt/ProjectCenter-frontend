export interface ProjectRequest {
	title: string
	typeId: number
	subjectId: number
	isPublic: boolean
}

export interface ProjectResponse {
	id: number
	title: string
	typeId: number
	subjectId: number
	isPublic: boolean

	typeName: string
	subjectName: string
	studentName: string
	teacherName: string
	statusName: string

	deadline: string
	createdAt: string
	comments: {
		userFullName: string
		text: string
		date: string
	}[]
}

export interface ProjectUI {
	id: number
	title: string
	typeId: number
	subjectId: number
	isPublic: boolean

	typeName: string
	subjectName: string
	studentName: string
	teacherName: string
	statusName: string
	
	dateDeadline: Date
	createdDate: Date
	comments: ProjectComment[]
}

export interface ProjectComment {
	userFullName: string
	text: string
	date: Date
}
