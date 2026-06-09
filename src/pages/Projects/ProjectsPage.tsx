import Header from '@/components/Header'
import Layout from '@/components/Layout'
import ProjectCard from './ProjectCard'
import { getProjectsWithFilters } from '@/services/projects'
import { getGroups } from '@/services/directory'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { ProjectUI } from '@/shared/types/project'
import type { GroupResponse } from '@/shared/types/group'
import { useNavigate } from 'react-router-dom'
import {
	Input,
	Field,
	Select,
	createListCollection,
	DatePicker,
	Portal,
	parseDate,
	Box,
	InputGroup,
	CloseButton,
} from '@chakra-ui/react'
import { LuCalendar, LuSearch } from 'react-icons/lu'

function ProjectsPage() {
	const [projects, setProjects] = useState<ProjectUI[]>([])
	const [searchText, setSearchText] = useState('')
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
	const [groups, setGroups] = useState<GroupResponse[]>([])
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const inputRef = useRef<HTMLInputElement | null>(null)

	const groupCollection = createListCollection({
		items: groups.map(g => ({ value: g.id.toString(), label: g.name })),
	})

	const loadProjects = useCallback(async () => {
		setLoading(true)
		try {
			const data = await getProjectsWithFilters(
				searchText || undefined,
				selectedYear || undefined,
				selectedGroupId || undefined,
			)

			const mapped: ProjectUI[] = data.map(p => ({
				...p,
				studentGroup: p.studentGroup || '',
				dateDeadline: new Date(p.dateDeadline),
				createdDate: new Date(p.createdDate),
				comments:
					p.comments?.map(c => ({
						...c,
						date: new Date(c.date),
					})) ?? [],
			}))
			setProjects(mapped)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}, [searchText, selectedYear, selectedGroupId])

	useEffect(() => {
		const timeout = setTimeout(() => {
			loadProjects()
		}, 300)
		return () => clearTimeout(timeout)
	}, [searchText, selectedYear, selectedGroupId, loadProjects])

	useEffect(() => {
		const loadGroups = async () => {
			const groupsData = await getGroups()
			setGroups(groupsData)
		}
		loadGroups()
	}, [])

	const handleClearSearch = () => {
		setSearchText('')
		inputRef.current?.focus()
	}

	const endElement = searchText ? (
		<CloseButton size='xs' onClick={handleClearSearch} me='-2' />
	) : undefined

	const getYearValue = () => {
		if (!selectedYear) return []
		try {
			const dateStr = `${selectedYear}-01-01`
			return [parseDate(dateStr)]
		} catch {
			return []
		}
	}

	return (
		<Layout>
			<Header />

			<section className='px-4 md:px-8 py-12 md:py-6 flex flex-col gap-6'>
				<h3 className='font-bold text-2xl'>Все проекты</h3>

				<Box className='flex flex-col md:flex-row gap-4'>
					<Field.Root className='flex-1'>
						<Field.Label>Поиск</Field.Label>
						<InputGroup
							flex='1'
							startElement={<LuSearch />}
							endElement={endElement}
						>
							<Input
								ref={inputRef}
								value={searchText}
								onChange={e => setSearchText(e.target.value)}
								placeholder='Поиск по названию, студенту...'
							/>
						</InputGroup>
					</Field.Root>

					<Field.Root className='w-full md:w-48'>
						<DatePicker.Root
							value={getYearValue()}
							onValueChange={e => {
								if (e.value && e.value.length > 0) {
									const year = e.value[0].year
									if (year >= 1970 && year <= 2069) {
										setSelectedYear(year)
									}
								} else {
									setSelectedYear(null)
								}
							}}
							defaultView='year'
							minView='year'
							placeholder='Год'
							format={date => date.year.toString()}
							min={parseDate('1970-01-01')}
							max={parseDate('2069-12-31')}
						>
							<DatePicker.Label>Год</DatePicker.Label>
							<DatePicker.Control>
								<DatePicker.Input />
								<DatePicker.IndicatorGroup>
									<DatePicker.ClearTrigger />
									<DatePicker.Trigger>
										<LuCalendar />
									</DatePicker.Trigger>
								</DatePicker.IndicatorGroup>
							</DatePicker.Control>
							<Portal>
								<DatePicker.Positioner>
									<DatePicker.Content>
										<DatePicker.View view='year'>
											<DatePicker.Header />
											<DatePicker.YearTable />
										</DatePicker.View>
									</DatePicker.Content>
								</DatePicker.Positioner>
							</Portal>
						</DatePicker.Root>
					</Field.Root>

					<Field.Root className='w-full md:w-64'>
						<Select.Root
							collection={groupCollection}
							value={selectedGroupId ? [selectedGroupId.toString()] : []}
							onValueChange={e => {
								setSelectedGroupId(e.value[0] ? Number(e.value[0]) : null)
							}}
						>
							<Select.HiddenSelect />
							<Select.Label>Группа</Select.Label>
							<Select.Control>
								<Select.Trigger className='cursor-pointer'>
									<Select.ValueText placeholder='Все группы' />
								</Select.Trigger>
								<Select.IndicatorGroup>
									<Select.ClearTrigger className='cursor-pointer' />
									<Select.Indicator />
								</Select.IndicatorGroup>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content>
										{groupCollection.items.map(g => (
											<Select.Item
												item={g}
												key={g.value}
												className='cursor-pointer'
											>
												{g.label}
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					</Field.Root>
				</Box>

				{loading ? (
					<div className='text-center text-gray-500 py-8'>Загрузка...</div>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full'>
							{projects.map(p => (
								<ProjectCard
									key={p.id}
									id={p.id}
									title={p.title}
									studentName={p.studentName}
									studentGroup={p.studentGroup}
									teacherName={p.teacherName}
									dateDeadline={p.dateDeadline}
									onClick={() => navigate(`/projects/${p.id}`)}
								/>
							))}
						</div>

						{projects.length === 0 && (
							<div className='text-center text-gray-500 py-8'>
								Проекты не найдены
							</div>
						)}
					</>
				)}
			</section>
		</Layout>
	)
}

export default ProjectsPage
