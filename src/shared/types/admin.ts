export interface AdminDashboardResponse {
  totalProjects: number
  totalStudents: number
  totalTeachers: number
  totalGroups: number
  totalSubjects: number
  overdueProjects: number
  projectsWithoutGrade: number
  averageGrade: number
  projectsByStatus: Array<{
    statusName: string
    count: number
  }>
  projectsByType: Array<{
    typeName: string
    count: number
  }>
  projectsByGroup: Array<{
    groupName: string
    totalProjects: number
    studentsCount: number
  }>
}

export interface AdminLastProject {
  id: number
  title: string
  studentName: string
  statusName: string
  createdDate: string
}

export interface AdminActiveTeacher {
  teacherName: string
  projectCount: number
}

export interface AdminRecentActivity {
  type: string
  description: string
  userName: string
  projectTitle: string
  date: string
}
