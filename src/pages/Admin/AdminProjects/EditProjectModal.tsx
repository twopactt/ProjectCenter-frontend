import { useEffect, useState } from 'react'
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
import { updateProjectByAdmin } from '@/services/projects'
import type { ProjectResponse } from '@/shared/types/project'

type Item = { value: string; label: string }

interface Props {
	project: ProjectResponse
	typeCollection: ListCollection<Item>
	subjectCollection: ListCollection<Item>
	statusCollection: ListCollection<Item>
	teacherCollection: ListCollection<Item>
	onClose: () => void
	onUpdated: () => void
}

export function EditProjectModal({
	project,
	typeCollection,
	subjectCollection,
	statusCollection,
	teacherCollection,
	onClose,
	onUpdated,
}: Props) {
	const [title, setTitle] = useState(project.title)
	const [typeId, setTypeId] = useState<number | null>(project.typeId)
	const [subjectId, setSubjectId] = useState<number | null>(project.subjectId)
	const [statusId, setStatusId] = useState<number | null>(null)
	const [teacherId, setTeacherId] = useState<number | null>(null)
	const [year, setYear] = useState(new Date().getFullYear())
	const [dateDeadline, setDateDeadline] = useState(
		project.dateDeadline ? project.dateDeadline.slice(0, 10) : '',
	)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		setTitle(project.title)
		setTypeId(project.typeId)
		setSubjectId(project.subjectId)
		setDateDeadline(
			project.dateDeadline ? project.dateDeadline.slice(0, 10) : '',
		)
	}, [project])

	const handleSave = async () => {
		if (!title.trim()) {
			showError('Введите название проекта')
			return
		}
		setSaving(true)
		const result = await updateProjectByAdmin(project.id, {
			title: title.trim(),
			typeId: typeId ?? undefined,
			subjectId: subjectId ?? undefined,
			statusId: statusId ?? undefined,
			teacherId: teacherId ?? undefined,
			year,
			dateDeadline: dateDeadline
				? new Date(dateDeadline).toISOString()
				: undefined,
		})
		setSaving(false)
		if (result) {
			showSuccess('Проект обновлён')
			onUpdated()
		} else {
			showError('Ошибка при обновлении проекта')
		}
	}

	return (
		<Dialog.Root
			open={true}
			onOpenChange={e => {
				if (!e.open) onClose()
			}}
			placement='center'
		>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Редактирование проекта</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Field.Root>
							<Text className='font-bold'>Название</Text>
							<Input value={title} onChange={e => setTitle(e.target.value)} />
						</Field.Root>
						<Field.Root>
							<Select.Root
								collection={statusCollection}
								value={statusId ? [String(statusId)] : []}
								onValueChange={v => setStatusId(Number(v.value))}
							>
								<Select.HiddenSelect />
								<Select.Label>Статус</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder={project.statusName} />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{statusCollection.items.map(s => (
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
								collection={teacherCollection}
								value={teacherId ? [String(teacherId)] : []}
								onValueChange={v => setTeacherId(Number(v.value))}
							>
								<Select.HiddenSelect />
								<Select.Label>Преподаватель</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText
											placeholder={
												project.teacherName || 'Выберите преподавателя'
											}
										/>
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{teacherCollection.items.map(t => (
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
								collection={typeCollection}
								value={typeId ? [String(typeId)] : []}
								onValueChange={v => setTypeId(Number(v.value))}
							>
								<Select.HiddenSelect />
								<Select.Label>Тип</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder={project.typeName} />
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
								value={subjectId ? [String(subjectId)] : []}
								onValueChange={v => setSubjectId(Number(v.value))}
							>
								<Select.HiddenSelect />
								<Select.Label>Предмет</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder={project.subjectName} />
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
							<Text className='font-bold'>Год</Text>
							<Input
								type='number'
								value={year}
								onChange={e => setYear(Number(e.target.value))}
							/>
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
						<Button variant='ghost' onClick={onClose}>
							Отмена
						</Button>
						<Button onClick={handleSave} loading={saving}>
							Сохранить
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
