import { Card, Text, Heading } from '@chakra-ui/react'

interface ProjectCardProps {
	title: string
	studentName: string
	statusName: string
	onClick: () => void
}

export default function ProjectCard({
	title,
	studentName,
	statusName,
	onClick,
}: ProjectCardProps) {
	return (
		<Card.Root
			variant='subtle'
			onClick={onClick}
			cursor='pointer'
			_hover={{ bg: 'gray.700' }}
			p={4}
		>
			<Card.Title size='md'>{title}</Card.Title>
			<Text>Студент: {studentName}</Text>
			<Text>Статус: {statusName}</Text>
		</Card.Root>
	)
}
