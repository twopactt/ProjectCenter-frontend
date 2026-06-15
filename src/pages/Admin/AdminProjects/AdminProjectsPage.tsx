import { useEffect, useState } from 'react'
import { Text, Table } from '@chakra-ui/react'
import AdminLayout from '../AdminLayout'
import { getProjects } from '@/services/projects'
import { getTypes, getSubjects, getStatuses } from '@/services/directory'
import { getTeachers } from '@/services/teachers'
import { getStudents } from '@/services/students'
import type { ProjectUI } from '@/shared/types/project'
import type { TeacherResponse } from '@/shared/types/teacher'
import type { StatusProjectResponse } from '@/shared/types/statusProject'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import type { StudentResponse } from '@/shared/types/student'
import config from '@/services/config'
import { transformProjectResponse } from '@/shared/helpers/projectTransform'
import { CreateProjectModal } from './CreateProjectModal'
import AdminProjectCard from './AdminProjectCard'

function AdminProjectsPage() {
	const [projects, setProjects] = useState<ProjectUI[]>([])
	const [teachers, setTeachers] = useState<TeacherResponse[]>([])
	const [statuses, setStatuses] = useState<StatusProjectResponse[]>([])
	const [types, setTypes] = useState<TypeResponse[]>([])
	const [subjects, setSubjects] = useState<SubjectResponse[]>([])
	const [students, setStudents] = useState<StudentResponse[]>([])
	const [loading, setLoading] = useState(true)

	const fetchData = async () => {
		setLoading(true)
		const [projectsData, teachersData, typesData, subjectsData, statusesData, studentsData] =
			await Promise.all([
				getProjects(),
				getTeachers(),
				getTypes(),
				getSubjects(),
				getStatuses(),
				getStudents(),
			])

		const transformed = await Promise.all(
			projectsData.map(p => transformProjectResponse(p, config.api.staticUrl)),
		)
		setProjects(transformed)
		setTeachers(teachersData)
		setTypes(typesData)
		setSubjects(subjectsData)
		setStatuses(statusesData)
		setStudents(studentsData)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const handleUpdated = (updated: ProjectUI) => {
		setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))
	}

	return (
		<AdminLayout>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-2xl'>Управление проектами</h3>
				<CreateProjectModal
					types={types}
					subjects={subjects}
					students={students}
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
									<AdminProjectCard
										key={p.id}
										project={p}
										teachers={teachers}
										statuses={statuses}
										types={types}
										subjects={subjects}
										onDeleted={fetchData}
										onUpdated={handleUpdated}
									/>
								))}
							</Table.Body>
						</Table.Root>
					</Table.ScrollArea>
				</div>
			)}
		</AdminLayout>
	)
}

export default AdminProjectsPage
