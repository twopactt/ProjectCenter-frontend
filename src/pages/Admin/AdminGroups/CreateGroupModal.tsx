import { showError, showSuccess } from '@/shared/utils/toast'
import { Button, Dialog, Field, Input, Portal, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { createGroup } from '@/services/directory'

interface CreateGroupModalProps {
	isOpen: boolean
	onClose: () => void
	onCreated: () => void
}

export function CreateGroupModal({
	isOpen,
	onClose,
	onCreated,
}: CreateGroupModalProps) {
	const [name, setName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async () => {
		const trimmed = name.trim()

		if (!trimmed) {
			setError('Введите название группы')
			showError('Введите название группы')
			return
		}

		setIsLoading(true)
		setError('')

		const result = await createGroup(trimmed)
		setIsLoading(false)

		if (result) {
			showSuccess('Группа создана')
			setName('')
			onClose()
			onCreated()
		} else {
			setError('Не удалось создать группу')
		}
	}

	const handleClose = () => {
		setName('')
		setError('')
		onClose()
	}

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={e => {
				if (!e.open) handleClose()
			}}
			placement='center'
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='mx-4'>
						<Dialog.Header>
							<Dialog.Title>Создание группы</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Field.Root invalid={!!error}>
								<Input
									value={name}
									onChange={e => {
										setName(e.target.value)
										if (error) setError('')
									}}
									placeholder='Название, например ИСП-23ис'
									maxLength={15}
								/>
								{error && (
									<Text fontSize='sm' color='red.500' mt={1}>
										{error}
									</Text>
								)}
							</Field.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='ghost' onClick={handleClose}>
								Отмена
							</Button>
							<Button onClick={handleSubmit} loading={isLoading}>
								Создать
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
