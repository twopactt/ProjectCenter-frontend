import { getAdminDashboard } from '@/services/admin'
import type { AdminDashboardResponse } from '@/shared/types/admin'
import { useEffect, useState } from 'react'
import { Card, Text, Stack, HStack } from '@chakra-ui/react'

function AdminDashboard() {
	const [data, setData] = useState<AdminDashboardResponse | null>(null)

	useEffect(() => {
		const load = async () => {
			const result = await getAdminDashboard()
			setData(result)
		}
		load()
	}, [])

	if (!data) {
		return (
			<div className='text-center text-gray-500 py-16'>Загрузка данных...</div>
		)
	}

	const maxStatusCount = Math.max(...data.projectsByStatus.map(s => s.count), 1)
	const maxTypeCount = Math.max(...data.projectsByType.map(s => s.count), 1)
	const maxMonthCount = Math.max(...data.projectsByMonth.map(m => m.count), 1)

	return (
		<div className='flex flex-col gap-6 w-full'>
			<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'>
				<StatCard label='Проекты' value={data.totalProjects} />
				<StatCard label='Студенты' value={data.totalStudents} />
				<StatCard label='Преподаватели' value={data.totalTeachers} />
				<StatCard label='Группы' value={data.totalGroups} />
				<StatCard label='Предметы' value={data.totalSubjects} />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<HighlightCard
					label='Просроченные проекты'
					value={data.overdueProjects}
					color='red'
				/>
				<HighlightCard
					label='Проекты без оценки'
					value={data.projectsWithoutGrade}
					color='orange'
				/>
				<HighlightCard
					label='Средняя оценка'
					value={data.averageGrade.toFixed(2)}
					color='blue'
				/>
			</div>

			<div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
				<Card.Root
					className='transition-all'
					_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
				>
					<Card.Header>
						<Card.Title>Статусы проектов</Card.Title>
					</Card.Header>
					<Card.Body>
						<Stack gap={3}>
							{data.projectsByStatus.map(s => (
								<BarRow
									key={s.statusName}
									label={s.statusName}
									count={s.count}
									max={maxStatusCount}
									color='bg-blue-500'
								/>
							))}
						</Stack>
					</Card.Body>
				</Card.Root>

				<Card.Root
					className='transition-all'
					_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
				>
					<Card.Header>
						<Card.Title>Типы проектов</Card.Title>
					</Card.Header>
					<Card.Body>
						<Stack gap={3}>
							{data.projectsByType.map(t => (
								<BarRow
									key={t.statusName}
									label={t.statusName}
									count={t.count}
									max={maxTypeCount}
									color='bg-purple-500'
								/>
							))}
						</Stack>
					</Card.Body>
				</Card.Root>

				<Card.Root
					className='transition-all'
					_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
				>
					<Card.Header>
						<Card.Title>Проекты по месяцам</Card.Title>
					</Card.Header>
					<Card.Body>
						<Stack gap={2}>
							{data.projectsByMonth.map(m => (
								<HStack key={m.month} gap={3}>
									<Text fontSize='sm' w='8'>
										{m.month}
									</Text>
									<div className='flex-1 bg-gray-200 rounded-full h-4 overflow-hidden'>
										<div
											className='bg-green-500 h-full rounded-full transition-all'
											style={{
												width: `${(m.count / maxMonthCount) * 100}%`,
											}}
										/>
									</div>
									<Text fontSize='sm' fontWeight='bold' w='6' textAlign='right'>
										{m.count}
									</Text>
								</HStack>
							))}
						</Stack>
					</Card.Body>
				</Card.Root>
			</div>
		</div>
	)
}

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<Card.Root
			className='text-center transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
		>
			<Card.Body className='py-4'>
				<Text fontSize='3xl' fontWeight='bold'>
					{value}
				</Text>
				<Text fontSize='sm' color='gray.500'>
					{label}
				</Text>
			</Card.Body>
		</Card.Root>
	)
}

function BarRow({
	label,
	count,
	max,
	color,
}: {
	label: string
	count: number
	max: number
	color: string
}) {
	return (
		<HStack
			className='transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
			gap={3}
		>
			<Text flex='1' fontSize='sm'>
				{label}
			</Text>
			<Text fontSize='sm' fontWeight='bold' w='6' textAlign='right'>
				{count}
			</Text>
			<div className='w-24 md:w-32 bg-gray-200 rounded-full h-3 overflow-hidden'>
				<div
					className={`${color} h-full rounded-full transition-all`}
					style={{ width: `${(count / max) * 100}%` }}
				/>
			</div>
		</HStack>
	)
}

function HighlightCard({
	label,
	value,
	color,
}: {
	label: string
	value: number | string
	color: string
}) {
	const textColor =
		color === 'red'
			? 'text-red-600'
			: color === 'orange'
				? 'text-orange-500'
				: 'text-blue-600'

	return (
		<Card.Root
			className='transition-all'
			_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
		>
			<Card.Body className='py-4 flex flex-row items-center gap-4'>
				<Text fontSize='3xl' fontWeight='bold' className={textColor}>
					{value}
				</Text>
				<Text fontSize='sm' color='gray.600'>
					{label}
				</Text>
			</Card.Body>
		</Card.Root>
	)
}

export default AdminDashboard
