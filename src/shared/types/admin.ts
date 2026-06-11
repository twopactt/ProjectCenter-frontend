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
    statusName: string
    count: number
  }>
  projectsByMonth: Array<{
    month: string
    count: number
  }>
}
