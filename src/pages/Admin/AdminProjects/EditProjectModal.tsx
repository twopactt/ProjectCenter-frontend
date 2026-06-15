import { useEffect, useMemo, useState } from 'react'
import {
	Button,
	Combobox,
	createListCollection,
	DatePicker,
	Dialog,
	Field,
	Input,
	parseDate,
	Portal,
	Select,
	Switch,
	Text,
	useFilter,
	useListCollection,
	FieldErrorText,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { updateProjectByAdmin } from '@/services/projects'
import config from '@/services/config'
import type { ProjectUI } from '@/shared/types/project'
import type { StatusProjectResponse } from '@/shared/types/statusProject'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import type { TeacherResponse } from '@/shared/types/teacher'
import { transformProjectResponse } from '@/shared/helpers/projectTransform'
import { LuCalendar } from 'react-icons/lu'

interface Props {
	isOpen: boolean
	onClose: () => void
	projectId: number
	initialData: {
		title: string
		teacherId: number
		statusId: number
		typeId: number
		subjectId: number
		isPublic: boolean
		createdDate: string
		dateDeadline: string
	}
	teachers: TeacherResponse[]
	statuses: StatusProjectResponse[]
	types: TypeResponse[]
	subjects: SubjectResponse[]
	isPublic: boolean
	onUpdated: (project: ProjectUI) => void
}

function EditProjectModal({
	isOpen,
	onClose,
	projectId,
	initialData,
	teachers,
	statuses,
	types,
	subjects,
	isPublic,
	onUpdated,
}: Props) {
	const [title, setTitle] = useState('')
	const [titleError, setTitleError] = useState(false)
	const [titleErrorMessage, setTitleErrorMessage] = useState('')

	const [teacherId, setTeacherId] = useState('')
	const [teacherError, setTeacherError] = useState(false)
	const [teacherErrorMessage, setTeacherErrorMessage] = useState('')

	const [statusId, setStatusId] = useState('')
	const [statusError, setStatusError] = useState(false)
	const [statusErrorMessage, setStatusErrorMessage] = useState('')

	const [typeId, setTypeId] = useState('')
	const [typeError, setTypeError] = useState(false)
	const [typeErrorMessage, setTypeErrorMessage] = useState('')

	const [subjectId, setSubjectId] = useState('')
	const [subjectError, setSubjectError] = useState(false)
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('')

	const [publicVal, setPublicVal] = useState(isPublic)

	const [dateDeadline, setDateDeadline] = useState('')
	const [dateError, setDateError] = useState(false)
	const [dateErrorMessage, setDateErrorMessage] = useState('')

	useEffect(() => {
		if (isOpen && initialData) {
			setTitle(initialData.title || '')
			setTeacherId(initialData.teacherId?.toString() || '')
			setStatusId(initialData.statusId?.toString() || '')
			setTypeId(initialData.typeId?.toString() || '')
			setSubjectId(initialData.subjectId?.toString() || '')
			setPublicVal(initialData.isPublic)
			setDateDeadline(initialData.dateDeadline || '')

			setTitleError(false)
			setTitleErrorMessage('')
			setTeacherError(false)
			setTeacherErrorMessage('')
			setStatusError(false)
			setStatusErrorMessage('')
			setTypeError(false)
			setTypeErrorMessage('')
			setSubjectError(false)
			setSubjectErrorMessage('')
			setDateError(false)
			setDateErrorMessage('')
		}
	}, [isOpen, projectId])

	const { contains } = useFilter({ sensitivity: 'base' })

	const teacherItems = useMemo(
		() =>
			teachers.map(t => ({
				value: t.id.toString(),
				label: `${t.surname} ${t.name} ${t.patronymic ?? ''}`,
			})),
		[teachers],
	)

	const { collection: teacherCollection, filter: filterTeacher } =
		useListCollection({
			initialItems: teacherItems,
			filter: contains,
		})

	const statusCollection = useMemo(
		() =>
			createListCollection({
				items: statuses.map(s => ({
					value: s.id.toString(),
					label: s.name,
				})),
			}),
		[statuses],
	)

	const typeCollection = useMemo(
		() =>
			createListCollection({
				items: types.map(t => ({
					value: t.id.toString(),
					label: t.name,
				})),
			}),
		[types],
	)

	const subjectCollection = useMemo(
		() =>
			createListCollection({
				items: subjects.map(s => ({
					value: s.id.toString(),
					label: s.name,
				})),
			}),
		[subjects],
	)

	const selectedStatusLabel =
		statusCollection.items.find(i => i.value === statusId)?.label || ''

	const selectedTypeLabel =
		typeCollection.items.find(i => i.value === typeId)?.label || ''

	const selectedSubjectLabel =
		subjectCollection.items.find(i => i.value === subjectId)?.label || ''

	const handleSave = async () => {
		if (!validate()) {
			showError('Заполните все поля')
			return
		}

		const data = {
			title,
			teacherId: Number(teacherId),
			statusId: Number(statusId),
			typeId: Number(typeId),
			subjectId: Number(subjectId),
			isPublic: publicVal,
			dateDeadline,
		}

		const updated = await updateProjectByAdmin(projectId, data)

		if (updated) {
			showSuccess('Проект успешно обновлен')
			const ui = await transformProjectResponse(updated, config.api.staticUrl)
			onUpdated(ui)
			onClose()
		} else {
			showError('Не удалось обновить проект')
		}
	}

	const getDateValue = () => {
		if (!dateDeadline) return []
		try {
			return [parseDate(dateDeadline)]
		} catch {
			return []
		}
	}

	const validate = () => {
		let valid = true

		if (!title.trim()) {
			setTitleError(true)
			setTitleErrorMessage('Введите название проекта')
			valid = false
		} else {
			setTitleError(false)
			setTitleErrorMessage('')
		}

		if (!teacherId) {
			setTeacherError(true)
			setTeacherErrorMessage('Выберите преподавателя')
			valid = false
		} else {
			setTeacherError(false)
			setTeacherErrorMessage('')
		}

		if (!statusId) {
			setStatusError(true)
			setStatusErrorMessage('Выберите статус проекта')
			valid = false
		} else {
			setStatusError(false)
			setStatusErrorMessage('')
		}

		if (!typeId) {
			setTypeError(true)
			setTypeErrorMessage('Выберите тип проекта')
			valid = false
		} else {
			setTypeError(false)
			setTypeErrorMessage('')
		}

		if (!subjectId) {
			setSubjectError(true)
			setSubjectErrorMessage('Выберите предмет')
			valid = false
		} else {
			setSubjectError(false)
			setSubjectErrorMessage('')
		}

		if (!dateDeadline) {
			setDateError(true)
			setDateErrorMessage('Выберите дату сдачи')
			valid = false
		} else {
			setDateError(false)
			setDateErrorMessage('')
		}

		return valid
	}

	return (
		<Dialog.Root open={isOpen} placement='center' scrollBehavior='inside'>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
						<Dialog.Header>
							<Dialog.Title>Редактирование проекта</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body className='flex flex-col gap-4'>
							<Field.Root invalid={titleError}>
								<Field.Label className='font-bold'>Название</Field.Label>
								<Input
									value={title}
									onChange={e => {
										setTitle(e.target.value)
										if (titleError) setTitleError(false)
									}}
								/>
								{titleError && (
									<FieldErrorText>{titleErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root invalid={statusError}>
								<Select.Root
									collection={statusCollection}
									value={statusId ? [statusId] : []}
									onValueChange={e => {
										setStatusId(e.value?.[0] ?? '')
										if (statusError) setStatusError(false)
									}}
								>
									<Select.HiddenSelect />
									<Select.Label>Статус</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText>
												{selectedStatusLabel || 'Выберите статус'}
											</Select.ValueText>
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Portal>
										<Select.Positioner>
											<Select.Content>
												{statusCollection.items.map(s => (
													<Select.Item item={s} key={s.value}>
														{s.label}
														<Select.ItemIndicator />
													</Select.Item>
												))}
											</Select.Content>
										</Select.Positioner>
									</Portal>
								</Select.Root>
								{statusError && (
									<FieldErrorText>{statusErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root invalid={typeError}>
								<Select.Root
									collection={typeCollection}
									value={typeId ? [typeId] : []}
									onValueChange={e => {
										setTypeId(e.value?.[0] ?? '')
										if (typeError) setTypeError(false)
									}}
								>
									<Select.HiddenSelect />
									<Select.Label>Тип проекта</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText>
												{selectedTypeLabel || 'Выберите тип'}
											</Select.ValueText>
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Portal>
										<Select.Positioner>
											<Select.Content>
												{typeCollection.items.map(t => (
													<Select.Item item={t} key={t.value}>
														{t.label}
														<Select.ItemIndicator />
													</Select.Item>
												))}
											</Select.Content>
										</Select.Positioner>
									</Portal>
								</Select.Root>
								{typeError && (
									<FieldErrorText>{typeErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root invalid={subjectError}>
								<Select.Root
									collection={subjectCollection}
									value={subjectId ? [subjectId] : []}
									onValueChange={e => setSubjectId(e.value?.[0] ?? '')}
								>
									<Select.HiddenSelect />
									<Select.Label>Предмет</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText>
												{selectedSubjectLabel || 'Выберите предмет'}
											</Select.ValueText>
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Portal>
										<Select.Positioner>
											<Select.Content>
												{subjectCollection.items.map(s => (
													<Select.Item item={s} key={s.value}>
														{s.label}
														<Select.ItemIndicator />
													</Select.Item>
												))}
											</Select.Content>
										</Select.Positioner>
									</Portal>
								</Select.Root>
								{subjectError && (
									<FieldErrorText>{subjectErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root invalid={teacherError}>
								<Combobox.Root
									collection={teacherCollection}
									value={teacherId ? [teacherId] : []}
									onValueChange={e => {
										setTeacherId(e.value?.[0] ?? '')
										if (teacherError) setTeacherError(false)
									}}
									onInputValueChange={({ inputValue }) =>
										filterTeacher(inputValue)
									}
								>
									<Combobox.Label>Преподаватель</Combobox.Label>
									<Combobox.Control>
										<Combobox.Input placeholder='Поиск преподавателя...' />
										<Combobox.IndicatorGroup>
											<Combobox.ClearTrigger />
											<Combobox.Trigger />
										</Combobox.IndicatorGroup>
									</Combobox.Control>
									<Portal>
										<Combobox.Positioner>
											<Combobox.Content>
												<Combobox.Empty>Преподаватель не найден</Combobox.Empty>
												{teacherCollection.items.map(item => (
													<Combobox.Item item={item} key={item.value}>
														{item.label}
														<Combobox.ItemIndicator />
													</Combobox.Item>
												))}
											</Combobox.Content>
										</Combobox.Positioner>
									</Portal>
								</Combobox.Root>
								{teacherError && (
									<FieldErrorText>{teacherErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Text className='font-semibold'>Видимость</Text>
							<Switch.Root
								checked={publicVal}
								onCheckedChange={e => setPublicVal(e.checked)}
								className='flex items-center gap-3'
							>
								<Switch.HiddenInput />
								<Switch.Control>
									<Switch.Thumb />
								</Switch.Control>
								<Switch.Label>Публичный доступ</Switch.Label>
							</Switch.Root>
							<Field.Root invalid={dateError}>
								<DatePicker.Root
									locale='ru-RU'
									value={getDateValue()}
									min={parseDate(initialData.createdDate)}
									format={date => date.toString()}
									onValueChange={e => {
										if (e.value?.[0]) {
											setDateDeadline(e.value[0].toString())
										}
									}}
								>
									<DatePicker.Label>Дата сдачи</DatePicker.Label>
									<DatePicker.Control>
										<DatePicker.Input readOnly />
										<DatePicker.IndicatorGroup>
											<DatePicker.Trigger>
												<LuCalendar />
											</DatePicker.Trigger>
										</DatePicker.IndicatorGroup>
									</DatePicker.Control>
									<Portal>
										<DatePicker.Positioner>
											<DatePicker.Content>
												<DatePicker.View view='day'>
													<DatePicker.Header />
													<DatePicker.DayTable />
												</DatePicker.View>
												<DatePicker.View view='month'>
													<DatePicker.Header />
													<DatePicker.MonthTable />
												</DatePicker.View>
												<DatePicker.View view='year'>
													<DatePicker.Header />
													<DatePicker.YearTable />
												</DatePicker.View>
											</DatePicker.Content>
										</DatePicker.Positioner>
									</Portal>
								</DatePicker.Root>
								{dateError && (
									<FieldErrorText>{dateErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Button onClick={onClose} variant='ghost'>
								Отмена
							</Button>
							<Button onClick={handleSave}>Сохранить</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export default EditProjectModal
