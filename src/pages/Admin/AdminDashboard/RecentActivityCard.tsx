import { Card, Text } from '@chakra-ui/react'
import type { AdminRecentActivity } from '@/shared/types/admin'
import { LuMessageSquare, LuStar, LuFolder } from 'react-icons/lu'

function RecentActivityCard({
	activities,
}: { activities: AdminRecentActivity[] }) {
	return (
		<Card.Root
			className='transition-all mt-6'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
		>
			<Card.Header>
				<Card.Title>Последняя активность</Card.Title>
			</Card.Header>
			<Card.Body>
				{activities.length === 0 ? (
					<Text color='gray.500'>Нет активности</Text>
				) : (
					<div className='flex flex-col gap-3'>
						{activities.map((a, i) => (
							<div key={i} className='flex items-start gap-3 py-3'>
								<div
									className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
										a.type === 'comment'
											? 'bg-blue-100 text-blue-600'
											: a.type === 'grade'
												? 'bg-yellow-100 text-yellow-600'
												: 'bg-gray-100 text-gray-500'
									}`}
								>
									{a.type === 'comment' ? (
										<LuMessageSquare size={16} />
									) : a.type === 'grade' ? (
										<LuStar size={16} />
									) : (
										<LuFolder size={16} />
									)}
								</div>
								<div className='flex-1 min-w-0'>
									<Text fontSize='sm'>
										<strong>{a.userName}</strong>{' '}
										{a.type === 'comment'
											? 'оставил комментарий'
											: a.type === 'grade'
												? 'выставил оценку'
												: 'выполнил действие'}
									</Text>
									<Text
										fontSize='sm'
										color='gray.600'
										className='line-clamp-2'
									>
										{a.description}
									</Text>
									<div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5'>
										<Text
											fontSize='xs'
											color='gray.400'
											className='truncate max-w-48 md:max-w-96'
										>
											{a.projectTitle}
										</Text>
										<Text
											fontSize='xs'
											color='gray.400'
											className='shrink-0'
										>
											{new Date(a.date).toLocaleDateString('ru-RU')}
										</Text>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</Card.Body>
		</Card.Root>
	)
}

export default RecentActivityCard
