import { Card, CardHeader, CardBody, DataList } from '@chakra-ui/react'

interface ProjectCardProps {
	id: number
	title: string
	studentName: string
	teacherName: string
	onClick: () => void
}

export default function ProjectCard({
	id,
	title,
	studentName,
	teacherName,
	onClick,
}: ProjectCardProps) {
	return (
		<Card.Root
			className='cursor-pointer transition-all'
			_hover={{ bg: 'gray.800' }}
			onClick={onClick}
			borderWidth='1px'
		>
			<CardHeader>
				<Card.Title>{title}</Card.Title>
			</CardHeader>

			<CardBody className='flex flex-col gap-1'>
				<DataList.Root orientation='horizontal' className='flex-wrap'>
					<DataList.Item>
						<DataList.ItemLabel>Студент</DataList.ItemLabel>
						<DataList.ItemValue>{studentName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Преподаватель</DataList.ItemLabel>
						<DataList.ItemValue>{teacherName}</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</CardBody>
		</Card.Root>
	)
}
