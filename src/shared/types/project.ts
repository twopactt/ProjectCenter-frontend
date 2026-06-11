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
	studentGroup: string

	dateDeadline: string
	createdDate: string
	comments: {
		userFullName: string
		text: string
		date: string
	}[]

	gradeValue?: number
	gradedBy?: string
	gradeComment?: string
	gradeDate?: string
	fileProject?: string | null
	fileDocumentation?: string | null
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
	studentGroup: string
	teacherName: string
	statusName: string

	dateDeadline: Date
	createdDate: Date
	comments: ProjectComment[]
	grade: ProjectGrade[]

	projectFile?: {
		url: string
		fileName: string
		fileSize: number
	} | null
	docFile?: {
		url: string
		fileName: string
		fileSize: number
	} | null
}

export interface ProjectComment {
	userFullName: string
	text: string
	date: Date
}

export interface ProjectGrade {
	teacherFullName: string
	value: number
	comment: string
	createdAt: Date
}

export interface TeacherProjectResponse {
	id: number
	fullName: string
	groupName: string
	projectId: number
	projectTitle: string
	projectStatus: string
	grade: number
	gradeComment: string
}
