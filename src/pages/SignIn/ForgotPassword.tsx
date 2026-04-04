import {
	Button,
	CloseButton,
	Dialog,
	Field,
	FieldErrorText,
	Input,
	Text,
} from '@chakra-ui/react'
import { useState } from 'react'

interface ForgotPasswordProps {
	open: boolean
	handleClose: () => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
	const [emailValue, setEmailValue] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [emailErrorMessage, setEmailErrorMessage] = useState('')

	const validateInputs = () => {
		if (!emailValue || !emailRegex.test(emailValue)) {
			setEmailError(true)
			setEmailErrorMessage('Введите корректный email.')
			return false
		}

		setEmailError(false)
		setEmailErrorMessage('')
		return true
	}

	const handleSubmit = () => {
		if (!validateInputs()) return
		handleClose()
	}

	return (
		<Dialog.Root
			placement={'center'}
			open={open}
			onOpenChange={e => {
				if (!e.open) handleClose()
			}}
		>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='mx-4'>
					<Dialog.Header>
						<Dialog.Title>Сбросить пароль</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body>
						<Field.Root invalid={emailError} className='gap-3'>
							<Text>
								Введите адрес электронной почты вашего аккаунта, и вам будет
								выслана ссылка для сброса пароля
							</Text>
							<Input
								value={emailValue}
								onChange={e => {
									setEmailValue(e.target.value)
									if (emailError) setEmailError(false)
								}}
								type='email'
								name='email'
								placeholder='example@email.com'
								autoComplete='email'
								required
							/>
							{emailError && (
								<FieldErrorText>{emailErrorMessage}</FieldErrorText>
							)}
						</Field.Root>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button variant='ghost'>Отмена</Button>
						</Dialog.ActionTrigger>
						<Button type='submit' onClick={handleSubmit}>
							Продолжить
						</Button>
					</Dialog.Footer>
					<Dialog.CloseTrigger asChild>
						<CloseButton size='sm' />
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default ForgotPassword
