import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react'

interface CookieConsentModalProps {
	open: boolean
	onClose: () => void
}

function CookieConsentModal({ open, onClose }: CookieConsentModalProps) {
	return (
		<Dialog.Root
			open={open}
			onOpenChange={e => {
				if (!e.open) onClose()
			}}
			placement='center'
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='mx-4'>
						<Dialog.Header>
							<Dialog.Title>
								В Вашем браузере должен быть разрешен прием cookies
							</Dialog.Title>
							<Dialog.CloseTrigger asChild>
								<CloseButton size='sm' />
							</Dialog.CloseTrigger>
						</Dialog.Header>
						<Dialog.Body className='flex flex-col gap-3'>
							<Text>На этом сайте используется файл cookie:</Text>
							<Text>
								Строго необходимым является файл cookie для сеансов, обычно
								называемый{' '}
								<Text as='span' fontStyle='italic'>
									SessionCookie
								</Text>
								. Вы должны разрешить использование этого файла cookie в своем
								браузере, чтобы обеспечить непрерывность при переходах и
								оставаться в системе при просмотре сайта. Когда вы выходите из
								системы или закрываете браузер, этот файл cookie уничтожается (в
								вашем браузере и на сервере).
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button onClick={onClose}>Ок</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export default CookieConsentModal
