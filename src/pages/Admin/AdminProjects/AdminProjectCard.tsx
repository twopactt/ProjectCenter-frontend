import { useState } from 'react'
import { Button, Table } from '@chakra-ui/react'
import type { ProjectUI } from '@/shared/types/project'
import type { TeacherResponse } from '@/shared/types/teacher'
import type { StatusProjectResponse } from '@/shared/types/statusProject'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import { StatusProjectBadge } from '@/components/StatusProjectBadge'
import { ConfirmModal } from '@/components/ConfirmModal'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import moment from 'moment/moment'
import EditProjectModal from './EditProjectModal'
import { deleteProject } from '@/services/projects'
import { showSuccess, showError } from '@/shared/utils/toast'

moment.locale('ru')

interface AdminProjectCardProps {
	project: ProjectUI
	teachers: TeacherResponse[]
	statuses: StatusProjectResponse[]
	types: TypeResponse[]
	subjects: SubjectResponse[]
	onDeleted: () => void
	onUpdated: (project: ProjectUI) => void
}

function AdminProjectCard({
	project,
	teachers,
	statuses,
	types,
	subjects,
	onDeleted,
	onUpdated,
}: AdminProjectCardProps) {
	const [editOpen, setEditOpen] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<ProjectUI | null>(null)

	const teacherFullName = (t: TeacherResponse) =>
		[t.surname, t.name, t.patronymic].filter(Boolean).join(' ')

	const resolvedTeacherId =
		teachers.find(t => teacherFullName(t) === project.teacherName)?.id ?? 0

	const resolvedStatusId =
		statuses.find(s => s.name === project.statusName)?.id ?? 0

	const resolvedTypeId =
		types.find(t => t.name === project.typeName)?.id ?? 0
		
	const resolvedSubjectId =
		subjects.find(s => s.name === project.subjectName)?.id ?? 0

	const handleDelete = async () => {
		if (!deleteTarget) return
		const ok = await deleteProject(deleteTarget.id)
		if (ok) {
			showSuccess('Проект удалён')
			setDeleteTarget(null)
			onDeleted()
		} else {
			showError('Ошибка при удалении проекта')
		}
	}

	return (
		<>
			<Table.Row>
				<Table.Cell>{project.id}</Table.Cell>
				<Table.Cell className='text-wrap' title={project.title}>
					{project.title}
				</Table.Cell>
				<Table.Cell>{project.studentName}</Table.Cell>
				<Table.Cell>{project.studentGroup}</Table.Cell>
				<Table.Cell>{project.teacherName || '—'}</Table.Cell>
				<Table.Cell>
					<StatusProjectBadge status={project.statusName} />
				</Table.Cell>
				<Table.Cell>{project.typeName}</Table.Cell>
				<Table.Cell>{project.subjectName}</Table.Cell>
				<Table.Cell>
					{moment(project.dateDeadline).format('DD.MM.YYYY')}
				</Table.Cell>
				<Table.Cell>
					<div className='flex gap-2'>
						<Button
							size='sm'
							variant='surface'
							colorPalette='blue'
							onClick={() => setEditOpen(true)}
						>
							<LuPencil />
						</Button>
						<Button
							size='sm'
							variant='surface'
							colorPalette='red'
							onClick={() => setDeleteTarget(project)}
						>
							<LuTrash2 />
						</Button>
					</div>
				</Table.Cell>
			</Table.Row>

			<ConfirmModal
				isOpen={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDelete}
				title='Удаление проекта'
				message='Вы уверены, что хотите удалить проект? Это действие нельзя отменить.'
				confirmText='Удалить'
				confirmColor='red'
			/>

			<EditProjectModal
				key={project.id}
				isOpen={editOpen}
				onClose={() => setEditOpen(false)}
				projectId={project.id}
				initialData={{
					title: project.title,
					teacherId: resolvedTeacherId,
					statusId: resolvedStatusId,
					typeId: resolvedTypeId,
					subjectId: resolvedSubjectId,
					isPublic: project.isPublic,
					createdDate: moment(project.createdDate).format('YYYY-MM-DD'),
					dateDeadline: moment(project.dateDeadline).format('YYYY-MM-DD'),
				}}
				teachers={teachers}
				statuses={statuses}
				types={types}
				subjects={subjects}
				isPublic={project.isPublic}
				onUpdated={onUpdated}
			/>
		</>
	)
}

export default AdminProjectCard
