import { useState } from 'react'
import {
	Button,
	CloseButton,
	Dialog,
	Field,
	Input,
	Select,
	Text,
	type ListCollection,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { createProjectByAdmin } from '@/services/projects'

type Item = { value: string; label: string }

interface Props {
	typeCollection: ListCollection<Item>
	subjectCollection: ListCollection<Item>
	studentCollection: ListCollection<Item>
	onCreated: () => void
}

export function CreateProjectModal({
	typeCollection,
	subjectCollection,
	studentCollection,
	onCreated,
}: Props) {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [typeId, setTypeId] = useState<number | null>(null)
	const [subjectId, setSubjectId] = useState<number | null>(null)
	const [studentUserId, setStudentUserId] = useState<number | null>(null)
	const [isPublic] = useState(true)
	const [dateDeadline, setDateDeadline] = useState('')
	const [creating, setCreating] = useState(false)

	const reset = () => {
		setTitle('')
		setTypeId(null)
		setSubjectId(null)
		setStudentUserId(null)
		setDateDeadline('')
	}

	const handleCreate = async () => {
		if (!title.trim() || !typeId || !subjectId || !studentUserId) {
			showError('Заполните все обязательные поля')
			return
		}
		setCreating(true)
		const result = await createProjectByAdmin({
			title: title.trim(),
			typeId,
			subjectId,
			isPublic,
			studentUserId,
			createdDate: new Date().toISOString(),
			dateDeadline: dateDeadline
				? new Date(dateDeadline).toISOString()
				: undefined,
		})
		setCreating(false)
		if (result) {
			showSuccess('Проект создан')
			setOpen(false)
			reset()
			onCreated()
		} else {
			showError('Ошибка при создании проекта')
		}
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={e => setOpen(e.open)}
			placement='center'
		>
			<Dialog.Trigger asChild>
				<Button className='cursor-pointer' onClick={() => setOpen(true)}>
					Создать
				</Button>
			</Dialog.Trigger>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Создание проекта</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Field.Root>
							<Text className='font-bold'>Название проекта</Text>
							<Input
								placeholder='Название проекта'
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</Field.Root>
						<Field.Root>
							<Select.Root
								collection={typeCollection}
								onValueChange={v => setTypeId(Number(v.value))}
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
						</Field.Root>
						<Field.Root>
							<Select.Root
								collection={subjectCollection}
								onValueChange={v => setSubjectId(Number(v.value))}
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
						</Field.Root>
						<Field.Root>
							<Select.Root
								collection={studentCollection}
								onValueChange={v => setStudentUserId(Number(v.value))}
							>
								<Select.HiddenSelect />
								<Select.Label>Студент</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder='Выберите студента' />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{studentCollection.items.map(s => (
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
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Дата дедлайна</Text>
							<Input
								type='date'
								value={dateDeadline}
								onChange={e => setDateDeadline(e.target.value)}
							/>
						</Field.Root>
					</Dialog.Body>
					<Dialog.Footer>
						<Button
							variant='ghost'
							onClick={() => {
								reset()
								setOpen(false)
							}}
						>
							Отмена
						</Button>
						<Button onClick={handleCreate} loading={creating}>
							Создать
						</Button>
						<Dialog.CloseTrigger asChild>
							<CloseButton size='sm' />
						</Dialog.CloseTrigger>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}
