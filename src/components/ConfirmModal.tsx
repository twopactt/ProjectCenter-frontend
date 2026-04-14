import { Button, Dialog, Portal, Text } from '@chakra-ui/react'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	message?: string
	confirmText?: string
	cancelText?: string
	confirmColor?: string
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'Подтверждение действия',
	message = 'Вы уверены, что хотите выполнить это действие?',
	confirmText = 'Подтвердить',
	cancelText = 'Отмена',
	confirmColor = 'red',
}: ConfirmModalProps) {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={e => {
				if (!e.open) onClose()
			}}
			placement='center'
			role='alertdialog'
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content  className='mx-4'>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text>{message}</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='ghost' onClick={onClose}>
								{cancelText}
							</Button>
							<Button colorPalette={confirmColor} onClick={handleConfirm}>
								{confirmText}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}
