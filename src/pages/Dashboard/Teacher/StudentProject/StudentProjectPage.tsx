import { Button } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Header'
import { getStudentProjectById } from '@/services/projects'
import type { ProjectUI } from '@/shared/types/project'
import { LuArrowLeft } from 'react-icons/lu'
import moment from 'moment/moment'
import 'moment/locale/ru'
import StudentProjectCard from './StudentProjectCard'
import config from '@/services/config'
import { getFileSize } from '@/shared/utils/fileSize'

moment.locale('ru')

function StudentProjectPage() {
	const { id } = useParams()
	const [project, setProject] = useState<ProjectUI | null>(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			const data = await getStudentProjectById(Number(id))

			if (data) {
				const projectFileSize = data.fileProject
					? await getFileSize(config.api.staticUrl + data.fileProject)
					: 0
				const docFileSize = data.fileDocumentation
					? await getFileSize(config.api.staticUrl + data.fileDocumentation)
					: 0

				setProject({
					id: data.id,
					title: data.title,
					typeId: data.typeId,
					subjectId: data.subjectId,
					isPublic: data.isPublic,

					typeName: data.typeName,
					subjectName: data.subjectName,
					studentName: data.studentName,
					teacherName: data.teacherName,
					statusName: data.statusName,

					dateDeadline: new Date(data.dateDeadline),
					createdDate: new Date(data.createdDate),

					comments:
						data.comments?.map(c => ({
							...c,
							date: new Date(c.date),
						})) ?? [],
					grade: data.gradeValue
						? [
								{
									teacherFullName: data.gradedBy || '',
									value: data.gradeValue,
									comment: data.gradeComment || '',
									createdAt: new Date(data.gradeDate || Date.now()),
								},
							]
						: [],
					projectFile: data.fileProject
						? {
								url: config.api.staticUrl + data.fileProject,
								fileName: data.fileProject.split('/').pop() || 'file',
								fileSize: projectFileSize,
							}
						: null,
					docFile: data.fileDocumentation
						? {
								url: config.api.staticUrl + data.fileDocumentation,
								fileName: data.fileDocumentation.split('/').pop() || 'file',
								fileSize: docFileSize,
							}
						: null,
				})
			}
			setLoading(false)
		}

		if (id) load()
	}, [id])

	if (loading) {
		return (
			<Layout>
				<Header />
				<div className='flex justify-center items-center h-[70vh] text-xl opacity-60'>
					Загрузка проекта...
				</div>
			</Layout>
		)
	}

	if (!project) {
		return (
			<Layout>
				<Header />
				<div className='flex justify-center items-center h-[70vh] text-xl opacity-60'>
					Проект не найден
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<Header />
			<section className='px-4 md:px-8 py-6 flex flex-col md:flex-row items-start w-full gap-2 md:gap-4'>
				<Button
					variant='outline'
					onClick={() => navigate(-1)}
					className='self-start mb-4 w-auto'
				>
					<LuArrowLeft />
					Назад
				</Button>

				<div className='w-full flex justify-center'>
					<StudentProjectCard project={project} />
				</div>
			</section>
		</Layout>
	)
}

export default StudentProjectPage
