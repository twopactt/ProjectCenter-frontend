import { Card, Text } from '@chakra-ui/react'
import type { AdminLastProject } from '@/shared/types/admin'

function LastProjectsCard({ projects }: { projects: AdminLastProject[] }) {
	return (
		<Card.Root
			className='transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
		>
			<Card.Header>
				<Card.Title>Последние проекты</Card.Title>
			</Card.Header>
			<Card.Body className='flex flex-col gap-3'>
				{projects.map(p => (
					<div key={p.id} className='flex items-center gap-3'>
						<div className='flex-1 min-w-0'>
							<Text fontSize='sm' fontWeight='medium' className='text-wrap'>
								{p.title}
							</Text>
							<Text fontSize='xs' color='gray.500'>
								{p.studentName}
							</Text>
						</div>
					</div>
				))}
			</Card.Body>
		</Card.Root>
	)
}

export default LastProjectsCard
