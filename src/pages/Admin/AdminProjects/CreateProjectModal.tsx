import { useMemo, useState } from 'react'
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
	FieldErrorText,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { createProjectByAdmin } from '@/services/projects'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import type { StudentResponse } from '@/shared/types/student'
import { LuCalendar } from 'react-icons/lu'

interface Props {
	types: TypeResponse[]
	subjects: SubjectResponse[]
	students: StudentResponse[]
	onCreated: () => void
}

export function CreateProjectModal({
	types,
	subjects,
	students,
	onCreated,
}: Props) {
	const { contains } = useFilter({ sensitivity: 'base' })

	const [open, setOpen] = useState(false)
	const [studentSearch, setStudentSearch] = useState('')

	const [title, setTitle] = useState('')
	const [titleError, setTitleError] = useState(false)
	const [titleErrorMessage, setTitleErrorMessage] = useState('')

	const [typeId, setTypeId] = useState('')
	const [typeError, setTypeError] = useState(false)
	const [typeErrorMessage, setTypeErrorMessage] = useState('')

	const [subjectId, setSubjectId] = useState('')
	const [subjectError, setSubjectError] = useState(false)
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('')

	const [studentUserId, setStudentUserId] = useState('')
	const [studentError, setStudentError] = useState(false)
	const [studentErrorMessage, setStudentErrorMessage] = useState('')

	const [publicVal, setPublicVal] = useState(true)

	const [dateDeadline, setDateDeadline] = useState('')
	const [dateError, setDateError] = useState(false)
	const [dateErrorMessage, setDateErrorMessage] = useState('')

	const [createdDate, setCreatedDate] = useState(
		new Date().toISOString().split('T')[0],
	)

	const [creating, setCreating] = useState(false)

	const resetForm = () => {
		setTitle('')
		setTitleError(false)
		setTitleErrorMessage('')
		setTypeId('')
		setTypeError(false)
		setTypeErrorMessage('')
		setSubjectId('')
		setSubjectError(false)
		setSubjectErrorMessage('')
		setStudentUserId('')
		setStudentError(false)
		setStudentErrorMessage('')
		setPublicVal(true)
		setCreatedDate(new Date().toISOString().split('T')[0])
		setDateDeadline('')
		setDateError(false)
		setDateErrorMessage('')
	}

	const studentItems = useMemo(
		() =>
			students.map(s => ({
				value: String(s.id),
				label: `${s.surname} ${s.name} ${s.patronymic ?? ''}`,
			})),
		[students],
	)

	const studentCollection = useMemo(
		() =>
			createListCollection({
				items: studentSearch
					? studentItems.filter(item => contains(item.label, studentSearch))
					: studentItems,
			}),
		[studentItems, studentSearch, contains],
	)

	const filterStudents = (value: string) => setStudentSearch(value)

	const typeCollection = useMemo(
		() =>
			createListCollection({
				items: types.map(t => ({
					value: String(t.id),
					label: t.name,
				})),
			}),
		[types],
	)

	const subjectCollection = useMemo(
		() =>
			createListCollection({
				items: subjects.map(s => ({
					value: String(s.id),
					label: s.name,
				})),
			}),
		[subjects],
	)

	const selectedTypeLabel =
		typeCollection.items.find(i => i.value === typeId)?.label || ''

	const selectedSubjectLabel =
		subjectCollection.items.find(i => i.value === subjectId)?.label || ''

	const getDateValue = (value: string) => {
		if (!value) return []
		try {
			return [parseDate(value)]
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

		if (!studentUserId) {
			setStudentError(true)
			setStudentErrorMessage('Выберите студента')
			valid = false
		} else {
			setStudentError(false)
			setStudentErrorMessage('')
		}

		if (!dateDeadline) {
			setDateError(true)
			setDateErrorMessage('Выберите дату сдачи')
			valid = false
		} else if (dateDeadline <= createdDate) {
			setDateError(true)
			setDateErrorMessage('Дата дедлайна должна быть позже даты создания')
			valid = false
		} else {
			setDateError(false)
			setDateErrorMessage('')
		}

		return valid
	}

	const handleCreate = async () => {
		if (!validate()) {
			showError('Заполните все обязательные поля')
			return
		}
		setCreating(true)
		const result = await createProjectByAdmin({
			title: title.trim(),
			typeId: Number(typeId),
			subjectId: Number(subjectId),
			isPublic: publicVal,
			studentUserId: Number(studentUserId),
			createdDate: new Date(createdDate).toISOString(),
			dateDeadline: new Date(dateDeadline).toISOString(),
		})
		setCreating(false)
		if ('data' in result) {
			showSuccess('Проект создан')
			setOpen(false)
			resetForm()
			onCreated()
		} else {
			showError(result.error)
		}
	}

	return (
		<Dialog.Root
			open={open}
			placement='center'
			scrollBehavior='inside'
		>
			<Dialog.Trigger asChild>
				<Button className='cursor-pointer' onClick={() => setOpen(true)}>
					Создать
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
						<Dialog.Header>
							<Dialog.Title>Создание проекта</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body className='flex flex-col gap-4'>
							<Field.Root invalid={titleError}>
								<Field.Label className='font-bold'>Название</Field.Label>
								<Input
									placeholder='Название проекта'
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
									onValueChange={e => {
										setSubjectId(e.value?.[0] ?? '')
										if (subjectError) setSubjectError(false)
									}}
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
							<Field.Root invalid={studentError}>
								<Combobox.Root
									collection={studentCollection}
									value={studentUserId ? [studentUserId] : []}
									onValueChange={e => {
										setStudentUserId(e.value?.[0] ?? '')
										if (studentError) setStudentError(false)
									}}
									onInputValueChange={({ inputValue }) =>
										filterStudents(inputValue)
									}
								>
									<Combobox.Label>Студент</Combobox.Label>
									<Combobox.Control>
										<Combobox.Input placeholder='Поиск студента...' />
										<Combobox.IndicatorGroup>
											<Combobox.ClearTrigger />
											<Combobox.Trigger />
										</Combobox.IndicatorGroup>
									</Combobox.Control>
									<Portal>
										<Combobox.Positioner>
											<Combobox.Content>
												<Combobox.Empty>
													Студент не найден
												</Combobox.Empty>
												{studentCollection.items.map(item => (
													<Combobox.Item item={item} key={item.value}>
														{item.label}
														<Combobox.ItemIndicator />
													</Combobox.Item>
												))}
											</Combobox.Content>
										</Combobox.Positioner>
									</Portal>
								</Combobox.Root>
								{studentError && (
									<FieldErrorText>{studentErrorMessage}</FieldErrorText>
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
							<Field.Root>
								<DatePicker.Root
									value={getDateValue(createdDate)}
									format={date => date.toString()}
									onValueChange={e => {
										if (e.value?.[0]) {
											setCreatedDate(e.value[0].toString())
										}
									}}
								>
									<DatePicker.Label>Дата создания</DatePicker.Label>
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
											</DatePicker.Content>
										</DatePicker.Positioner>
									</Portal>
								</DatePicker.Root>
							</Field.Root>
							<Field.Root invalid={dateError}>
								<DatePicker.Root
									value={getDateValue(dateDeadline)}
									min={parseDate(createdDate)}
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
							<Button
								variant='ghost'
								onClick={() => {
									resetForm()
									setOpen(false)
								}}
							>
								Отмена
							</Button>
							<Button onClick={handleCreate} loading={creating}>
								Создать
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
