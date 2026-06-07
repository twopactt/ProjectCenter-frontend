import {
	Button,
	Dialog,
	Field,
	Input,
	Select,
	DatePicker,
	Portal,
	parseDate,
	createListCollection,
	FieldErrorText,
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import type { TypeResponse } from '@/shared/types/typeProject'
import type { SubjectResponse } from '@/shared/types/subject'
import { updateStudentProjectById } from '@/services/projects'
import { LuCalendar } from 'react-icons/lu'
import type { ProjectUI } from '@/shared/types/project'
import { showError, showSuccess } from '@/shared/utils/toast'
import moment from 'moment/moment'
import 'moment/locale/ru'

moment.locale('ru')

interface Props {
	isOpen: boolean
	onClose: () => void
	projectId: number
	initialData: {
		title: string
		typeId: number
		subjectId: number
		createdDate: string
		dateDeadline: string
	}
	types: TypeResponse[]
	subjects: SubjectResponse[]
	onUpdated: (project: ProjectUI) => void
}

function EditStudentProjectModal({
	isOpen,
	onClose,
	projectId,
	initialData,
	types,
	subjects,
	onUpdated,
}: Props) {
	const [title, setTitle] = useState('')
	const [titleError, setTitleError] = useState(false)
	const [titleErrorMessage, setTitleErrorMessage] = useState('')
	const [typeId, setTypeId] = useState('')
	const [typeError, setTypeError] = useState(false)
	const [typeErrorMessage, setTypeErrorMessage] = useState('')
	const [subjectId, setSubjectId] = useState('')
	const [subjectError, setSubjectError] = useState(false)
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('')
	const [dateDeadline, setDateDeadline] = useState('')
	const [dateError, setDateError] = useState(false)
	const [dateErrorMessage, setDateErrorMessage] = useState('')

	useEffect(() => {
		if (isOpen && initialData) {
			setTitle(initialData.title || '')
			setTypeId(initialData.typeId?.toString() || '')
			setSubjectId(initialData.subjectId?.toString() || '')
			setDateDeadline(initialData.dateDeadline || '')

			setTitleError(false)
			setTitleErrorMessage('')
			setTypeError(false)
			setTypeErrorMessage('')
			setSubjectError(false)
			setSubjectErrorMessage('')
			setDateError(false)
			setDateErrorMessage('')
		}
	}, [isOpen, initialData])

	useEffect(() => {
		if (types.length && initialData.typeId) {
			setTypeId(initialData.typeId.toString())
		}
	}, [types, initialData.typeId])

	useEffect(() => {
		if (subjects.length && initialData.subjectId) {
			setSubjectId(initialData.subjectId.toString())
		}
	}, [subjects, initialData.subjectId])

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
			typeId: Number(typeId),
			subjectId: Number(subjectId),
			dateDeadline,
		}

		const updated = await updateStudentProjectById(projectId, data)

		if (updated) {
			showSuccess('Проект успешно обновлен')
			onUpdated(updated)
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
		<Dialog.Root open={isOpen} placement='center'>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
						<Dialog.Header>
							<Dialog.Title>Редактирование проекта</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body className='flex flex-col gap-4'>
							<Field.Root invalid={titleError}>
								<Field.Label>Название проекта</Field.Label>
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
							<Field.Root invalid={typeError}>
								<Select.Root
									key={typeId}
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
									key={subjectId}
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
							<Field.Root invalid={dateError}>
								<DatePicker.Root
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

export default EditStudentProjectModal
