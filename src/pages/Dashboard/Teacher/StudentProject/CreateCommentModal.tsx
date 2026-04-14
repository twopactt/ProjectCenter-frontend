import { showError } from '@/shared/utils/toast'
import { Button, Dialog, Portal, Textarea, Text, Field } from '@chakra-ui/react'
import { useState } from 'react'

interface CreateCommentModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (text: string) => Promise<void>
	projectId: number
}

export function CreateCommentModal({
	isOpen,
	onClose,
	onSubmit,
	projectId,
}: CreateCommentModalProps) {
	const [comment, setComment] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async () => {
		const trimmedComment = comment.trim()

		if (!trimmedComment) {
			setError('Комментарий не может быть пустым')
			showError('Заполнить текст комментария')
			return
		}

		if (trimmedComment.length > 1000) {
			setError('Комментарий не может превышать 1000 символов')
			showError('Слишком длинный текст комментария')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			await onSubmit(trimmedComment)
			setComment('')
			onClose()
		} catch {
			setError('Не удалось добавить комментарий')
		} finally {
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		setComment('')
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
					<Dialog.Content className=' mx-4'>
						<Dialog.Header>
							<Dialog.Title>Добавить комментарий</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Field.Root invalid={!!error}>
								<Textarea
									value={comment}
									onChange={e => {
										setComment(e.target.value)
										if (error) setError('')
									}}
									placeholder='Введите ваш комментарий...'
									minH='120px'
									maxLength={1000}
								/>
								{error && (
									<Text fontSize='sm' color='red.500' mt={1}>
										{error}
									</Text>
								)}
								<Text fontSize='sm' color='gray.500' mt={1}>
									{comment.length}/1000 символов
								</Text>
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
