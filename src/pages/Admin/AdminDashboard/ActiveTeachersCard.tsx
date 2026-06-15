import { Card, Text } from '@chakra-ui/react'
import type { AdminActiveTeacher } from '@/shared/types/admin'

function ActiveTeachersCard({ teachers }: { teachers: AdminActiveTeacher[] }) {
	return (
		<Card.Root
			className='transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
		>
			<Card.Header>
				<Card.Title>Активные преподаватели</Card.Title>
			</Card.Header>
			<Card.Body className='flex flex-col gap-3'>
				{teachers.map(t => (
					<div key={t.teacherName} className='flex items-center justify-between'>
						<Text fontSize='sm'>{t.teacherName}</Text>
						<Text fontSize='sm' fontWeight='bold'>
							{t.projectCount}
						</Text>
					</div>
				))}
			</Card.Body>
		</Card.Root>
	)
}

export default ActiveTeachersCard
