import { useEffect, useState } from 'react'
import {
	Button,
	Text,
	Table,
	createListCollection,
} from '@chakra-ui/react'
import AdminLayout from '../AdminLayout'
import { showSuccess, showError } from '@/shared/utils/toast'
import { getProjects, deleteProject } from '@/services/projects'
import { getTypes, getSubjects, getStatuses } from '@/services/directory'
import { getUsers } from '@/services/users'
import type { ProjectResponse } from '@/shared/types/project'
import { StatusProjectBadge } from '@/components/StatusProjectBadge'
import { ConfirmModal } from '@/components/ConfirmModal'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { CreateProjectModal } from './CreateProjectModal'
import { EditProjectModal } from './EditProjectModal'

type Item = { value: string; label: string }

function AdminProjectsPage() {
	const [projects, setProjects] = useState<ProjectResponse[]>([])
	const [types, setTypes] = useState<Item[]>([])
	const [subjects, setSubjects] = useState<Item[]>([])
	const [statuses, setStatuses] = useState<Item[]>([])
	const [students, setStudents] = useState<Item[]>([])
	const [teachers, setTeachers] = useState<Item[]>([])
	const [loading, setLoading] = useState(true)

	const [editProject, setEditProject] = useState<ProjectResponse | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<ProjectResponse | null>(null)

	const fetchData = async () => {
		setLoading(true)
		const [projectsData, typesData, subjectsData, statusesData, usersData] =
			await Promise.all([
				getProjects(),
				getTypes(),
				getSubjects(),
				getStatuses(),
				getUsers(),
			])
		setProjects(projectsData)
		setTypes(typesData.map(t => ({ value: String(t.id), label: t.name })))
		setSubjects(subjectsData.map(s => ({ value: String(s.id), label: s.name })))
		setStatuses(statusesData.map(s => ({ value: String(s.id), label: s.name })))
		setStudents(
			usersData
				.filter(u => u.role === 'Student')
				.map(u => ({
					value: String(u.id),
					label: `${u.surname} ${u.name} ${u.patronymic}`,
				})),
		)
		setTeachers(
			usersData
				.filter(u => u.role === 'Teacher')
				.map(u => ({
					value: String(u.id),
					label: `${u.surname} ${u.name} ${u.patronymic}`,
				})),
		)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const handleDelete = async () => {
		if (!deleteTarget) return
		const ok = await deleteProject(deleteTarget.id)
		if (ok) {
			showSuccess('Проект удалён')
			setDeleteTarget(null)
			fetchData()
		} else {
			showError('Ошибка при удалении проекта')
		}
	}

	const typeCollection = createListCollection({ items: types })
	const subjectCollection = createListCollection({ items: subjects })
	const statusCollection = createListCollection({ items: statuses })
	const studentCollection = createListCollection({ items: students })
	const teacherCollection = createListCollection({ items: teachers })

	return (
		<AdminLayout>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-2xl'>Управление проектами</h3>
				<CreateProjectModal
					typeCollection={typeCollection}
					subjectCollection={subjectCollection}
					studentCollection={studentCollection}
					onCreated={fetchData}
				/>
			</div>

			{loading ? (
				<Text className='text-center py-16 text-gray-500'>Загрузка...</Text>
			) : projects.length === 0 ? (
				<Text className='text-center py-16 text-gray-500'>
					Проекты не найдены
				</Text>
			) : (
				<div className='overflow-x-auto'>
					<Table.ScrollArea className='h-190' borderWidth='1px'>
						<Table.Root showColumnBorder stickyHeader interactive>
							<Table.Header>
								<Table.Row bg='bg.subtle'>
									<Table.ColumnHeader>ID</Table.ColumnHeader>
									<Table.ColumnHeader>Название</Table.ColumnHeader>
									<Table.ColumnHeader>Студент</Table.ColumnHeader>
									<Table.ColumnHeader>Группа</Table.ColumnHeader>
									<Table.ColumnHeader>Преподаватель</Table.ColumnHeader>
									<Table.ColumnHeader>Статус</Table.ColumnHeader>
									<Table.ColumnHeader>Тип</Table.ColumnHeader>
									<Table.ColumnHeader>Предмет</Table.ColumnHeader>
									<Table.ColumnHeader>Дедлайн</Table.ColumnHeader>
									<Table.ColumnHeader className='w-5'>
										Действия
									</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{projects.map(p => (
									<Table.Row key={p.id}>
										<Table.Cell>{p.id}</Table.Cell>
										<Table.Cell className='text-wrap' title={p.title}>
											{p.title}
										</Table.Cell>
										<Table.Cell>{p.studentName}</Table.Cell>
										<Table.Cell>{p.studentGroup}</Table.Cell>
										<Table.Cell>{p.teacherName || '—'}</Table.Cell>
										<Table.Cell>
											<StatusProjectBadge status={p.statusName} />
										</Table.Cell>
										<Table.Cell>{p.typeName}</Table.Cell>
										<Table.Cell>{p.subjectName}</Table.Cell>
										<Table.Cell>
											{p.dateDeadline
												? new Date(p.dateDeadline).toLocaleDateString('ru-RU')
												: '—'}
										</Table.Cell>
										<Table.Cell>
											<div className='flex gap-2'>
												<Button
													size='sm'
													variant='surface'
													colorPalette='blue'
													onClick={() => setEditProject(p)}
												>
													<LuPencil />
												</Button>
												<Button
													size='sm'
													variant='surface'
													colorPalette='red'
													onClick={() => setDeleteTarget(p)}
												>
													<LuTrash2 />
												</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Table.ScrollArea>
				</div>
			)}

			<ConfirmModal
				isOpen={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDelete}
				title='Удаление проекта'
				message='Вы уверены, что хотите удалить проект? Это действие нельзя отменить.'
				confirmText='Удалить'
				confirmColor='red'
			/>

			{editProject && (
				<EditProjectModal
					project={editProject}
					typeCollection={typeCollection}
					subjectCollection={subjectCollection}
					statusCollection={statusCollection}
					teacherCollection={teacherCollection}
					onClose={() => setEditProject(null)}
					onUpdated={() => {
						setEditProject(null)
						fetchData()
					}}
				/>
			)}
		</AdminLayout>
	)
}

export default AdminProjectsPage
