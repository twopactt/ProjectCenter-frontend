import { Card, CardHeader, CardBody, DataList } from '@chakra-ui/react'
import { StatusProjectBadge } from '@/components/StatusProjectBadge'

interface TeacherProjectCardProps {
	id: number
	fullName: string
	groupName: string
	projectId: number
	projectTitle: string
	projectStatus: string
	grade: number
	gradeComment: string
	onClick: () => void
}

function TeacherProjectCard({
	id,
	fullName,
	groupName,
	projectId,
	projectTitle,
	projectStatus,
	grade,
	gradeComment,
	onClick,
}: TeacherProjectCardProps) {
	return (
		<Card.Root
			className='cursor-pointer transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
			onClick={onClick}
			borderWidth='1px'
		>
			<CardHeader>
				<Card.Title>{projectTitle}</Card.Title>
			</CardHeader>

			<CardBody className='flex flex-col gap-1'>
				<DataList.Root orientation='horizontal' className='flex-wrap'>
					<DataList.Item>
						<DataList.ItemLabel>Студент</DataList.ItemLabel>
						<DataList.ItemValue>{fullName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Группа</DataList.ItemLabel>
						<DataList.ItemValue>{groupName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Статус</DataList.ItemLabel>
						<DataList.ItemValue>
							<StatusProjectBadge status={projectStatus} />
						</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</CardBody>
		</Card.Root>
	)
}

export default TeacherProjectCard
