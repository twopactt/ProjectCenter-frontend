import {
	Button,
	Dialog,
	Portal,
	Textarea,
	Text,
	RatingGroup,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { showSuccess, showError } from '@/shared/utils/toast'

interface GradeModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (value: number, comment: string) => Promise<void>
	initialValue?: number
	initialComment?: string
	isEditing?: boolean
}

export function GradeModal({
	isOpen,
	onClose,
	onSubmit,
	initialValue = 0,
	initialComment = '',
	isEditing = false,
}: GradeModalProps) {
	const [value, setValue] = useState(initialValue)
	const [comment, setComment] = useState(initialComment)
	const [isLoading, setIsLoading] = useState(false)
	const [valueError, setValueError] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setValue(initialValue)
			setComment(initialComment)
			setValueError(false)
		}
	}, [isOpen, initialValue, initialComment])

	const handleSubmit = async () => {
		if (value === 0) {
			setValueError(true)
			showError('Оценка не должна быть пустой')
			return
		}

		if (comment.length > 1000) {
			showError('Слишком длинный текст комментария')
			return
		}

		setIsLoading(true)
		setValueError(false)

		try {
			await onSubmit(value, comment.trim())
			showSuccess(isEditing ? 'Оценка обновлена' : 'Оценка добавлена')
			onClose()
		} catch {
			showError(
				isEditing ? 'Не удалось обновить оценку' : 'Не удалось добавить оценку',
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		setValue(initialValue)
		setComment(initialComment)
		setValueError(false)
		onClose()
	}

	const handleValueChange = (newValue: number) => {
		setValue(newValue)
		if (valueError && newValue > 0) {
			setValueError(false)
		}
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
							<Dialog.Title>
								{isEditing ? 'Редактирование оценки' : 'Поставить оценку'}
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text mb={2} fontWeight='medium'>
								Оценка
							</Text>
							<RatingGroup.Root
								colorPalette='orange'
								count={5}
								value={value}
								onValueChange={e => handleValueChange(e.value)}
								size='lg'
							>
								<RatingGroup.HiddenInput />
								<RatingGroup.Control />
							</RatingGroup.Root>
							{valueError && (
								<Text fontSize='sm' color='red.500' mt={1}>
									Пожалуйста, поставьте оценку
								</Text>
							)}

							<Text mt={4} mb={2} fontWeight='medium'>
								Комментарий (необязательно)
							</Text>
							<Textarea
								value={comment}
								onChange={e => setComment(e.target.value)}
								placeholder='Введите комментарий...'
								minH='100px'
								maxLength={1000}
								borderColor={comment.length > 1000 ? 'red.500' : undefined}
							/>
							<Text fontSize='sm' color='gray.500' mt={1}>
								{comment.length}/1000 символов
							</Text>
							{comment.length > 1000 && (
								<Text fontSize='sm' color='red.500' mt={1}>
									Комментарий не может превышать 1000 символов
								</Text>
							)}
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='ghost' onClick={handleClose}>
								Отмена
							</Button>
							<Button onClick={handleSubmit} loading={isLoading}>
								{isEditing ? 'Сохранить' : 'Создать'}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
