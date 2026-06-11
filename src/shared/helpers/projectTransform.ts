import type { ProjectResponse, ProjectUI } from '@/shared/types/project'
import { getFileSize } from '@/shared/utils/fileSize'

export async function transformProjectResponse(
  data: ProjectResponse,
  staticUrl: string,
): Promise<ProjectUI> {
  const [projectFileSize, docFileSize] = await Promise.all([
    data.fileProject ? getFileSize(staticUrl + data.fileProject) : 0,
    data.fileDocumentation ? getFileSize(staticUrl + data.fileDocumentation) : 0,
  ])

  return {
    id: data.id,
    title: data.title,
    typeId: data.typeId,
    subjectId: data.subjectId,
    isPublic: data.isPublic,
    typeName: data.typeName,
    subjectName: data.subjectName,
    studentName: data.studentName,
    studentGroup: data.studentGroup,
    teacherName: data.teacherName,
    statusName: data.statusName,
    dateDeadline: new Date(data.dateDeadline),
    createdDate: new Date(data.createdDate),
    comments: data.comments.map(c => ({
      ...c,
      date: new Date(c.date),
    })),
    grade: data.gradeValue
      ? [
          {
            teacherFullName: data.gradedBy ?? '',
            value: data.gradeValue,
            comment: data.gradeComment ?? '',
            createdAt: new Date(data.gradeDate ?? Date.now()),
          },
        ]
      : [],
    projectFile: data.fileProject
      ? {
          url: staticUrl + data.fileProject,
          fileName: data.fileProject.split('/').pop() || 'file',
          fileSize: projectFileSize,
        }
      : null,
    docFile: data.fileDocumentation
      ? {
          url: staticUrl + data.fileDocumentation,
          fileName: data.fileDocumentation.split('/').pop() || 'file',
          fileSize: docFileSize,
        }
      : null,
  }
}
