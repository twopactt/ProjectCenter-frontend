import {
	Button,
	CloseButton,
	Dialog,
	Field,
	FieldErrorText,
	Input,
	Select,
	Text,
	type ListCollection,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { useState } from 'react'

type Item = { value: string; label: string }

interface Props {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
	title: string
	setTitle: (v: string) => void
	typeCollection: ListCollection<Item>
	subjectCollection: ListCollection<Item>
	setTypeId: (v: number) => void
	setSubjectId: (v: number) => void
	typeId: number | null
	subjectId: number | null
	onCreate: () => void
}

function CreateProjectModal({
	title,
	setTitle,
	typeCollection,
	subjectCollection,
	setTypeId,
	setSubjectId,
	typeId,
	subjectId,
	onCreate,
}: Props) {
	const [error, setError] = useState('')
	const [titleError, setTitleError] = useState(false)
	const [titleErrorMessage, setTitleErrorMessage] = useState('')

	const [typeError, setTypeError] = useState(false)
	const [typeErrorMessage, setTypeErrorMessage] = useState('')

	const [subjectError, setSubjectError] = useState(false)
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('')

	const validateInputs = () => {
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
			setSubjectErrorMessage('Выберите предмет проекта')
			valid = false
		} else {
			setSubjectError(false)
			setSubjectErrorMessage('')
		}

		return valid
	}

	const handleCreate = () => {
		if (!validateInputs()) {
			showError('Заполните все поля')
			return
		}
		if (!title.trim()) return setError('Введите название проекта')
		if (!typeId) return setError('Выберите тип проекта')
		if (!subjectId) return setError('Выберите предмет')

		setError('')
		showSuccess('Проект создан')
		onCreate()
	}

	return (
		<Dialog.Root placement={'center'}>
			<Dialog.Backdrop />
			<Dialog.Trigger asChild>
				<Button className='button'>Создать проект</Button>
			</Dialog.Trigger>
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Создание проекта</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Field.Root invalid={titleError}>
							<Text className='font-bold'>Название проекта</Text>
							<Input
								placeholder='Название проекта'
								value={title}
								onChange={e => {
									setTitle(e.target.value)
									setError('')
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
								onValueChange={v => {
									setTypeId(Number(v.value))
									setError('')
									if (typeError) setTypeError(false)
								}}
							>
								<Select.HiddenSelect />
								<Select.Label>Тип проекта</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder='Выберите тип' />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{typeCollection.items.map(t => (
											<Select.Item
												item={t}
												key={t.value}
												className='cursor-pointer'
											>
												{t.label}
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Select.Root>
							{typeError && <FieldErrorText>{typeErrorMessage}</FieldErrorText>}
						</Field.Root>
						<Field.Root invalid={subjectError}>
							<Select.Root
								collection={subjectCollection}
								onValueChange={v => {
									setSubjectId(Number(v.value))
									setError('')
									if (subjectError) setSubjectError(false)
								}}
							>
								<Select.HiddenSelect />
								<Select.Label>Предмет</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder='Выберите предмет' />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{subjectCollection.items.map(s => (
											<Select.Item
												item={s}
												key={s.value}
												className='cursor-pointer'
											>
												{s.label}
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Select.Root>
							{subjectError && (
								<FieldErrorText>{subjectErrorMessage}</FieldErrorText>
							)}
						</Field.Root>
						{error && (
							<Text color='red.500' fontSize='sm'>
								{error}
							</Text>
						)}
					</Dialog.Body>

					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button variant='ghost'>Отмена</Button>
						</Dialog.ActionTrigger>
						<Button onClick={handleCreate}>Создать</Button>
						<Dialog.CloseTrigger asChild>
							<CloseButton size='sm' />
						</Dialog.CloseTrigger>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default CreateProjectModal
