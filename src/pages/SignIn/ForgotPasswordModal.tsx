import {
	Button,
	Dialog,
	Field,
	FieldErrorText,
	Input,
	Text,
} from '@chakra-ui/react'
import { PasswordInput } from '@/components/ui/password-input'
import { showError, showSuccess } from '@/shared/utils/toast'
import { useState } from 'react'
import {
	forgotPassword,
	verifyCode,
	resetPassword,
} from '@/services/passwordResets'

interface ForgotPasswordModalProps {
	open: boolean
	handleClose: () => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const passwordRules = [
	{ test: (v: string) => v.length >= 8, text: 'минимум 8 символов' },
	{
		test: (v: string) => /[a-z]/.test(v),
		text: 'хотя бы одну строчную латинскую букву',
	},
	{
		test: (v: string) => /[A-Z]/.test(v),
		text: 'хотя бы одну заглавную латинскую букву',
	},
	{ test: (v: string) => /\d/.test(v), text: 'хотя бы одну цифру' },
	{
		test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
		text: 'хотя бы один спецсимвол',
	},
]

function ForgotPasswordModal({ open, handleClose }: ForgotPasswordModalProps) {
	const [step, setStep] = useState(1)
	const [loading, setLoading] = useState(false)

	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)

	const [code, setCode] = useState('')
	const [codeError, setCodeError] = useState(false)

	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState(false)
	const [passwordErrorText, setPasswordErrorText] = useState('')

	const [confirmPassword, setConfirmPassword] = useState('')
	const [confirmError, setConfirmError] = useState(false)

	const reset = () => {
		setStep(1)
		setLoading(false)
		setEmail('')
		setEmailError(false)
		setCode('')
		setCodeError(false)
		setPassword('')
		setPasswordError(false)
		setPasswordErrorText('')
		setConfirmPassword('')
		setConfirmError(false)
	}

	const handleCloseWrapped = () => {
		reset()
		handleClose()
	}

	const handleSendCode = async () => {
		if (!email || !emailRegex.test(email)) {
			setEmailError(true)
			return
		}
		setEmailError(false)
		setLoading(true)

		const res = await forgotPassword(email)
		setLoading(false)

		if (!res.success) {
			showError(res.message)
			return
		}

		showSuccess(res.message)
		setStep(2)
	}

	const handleVerifyCode = async () => {
		if (!code) {
			setCodeError(true)
			return
		}
		setCodeError(false)
		setLoading(true)

		const res = await verifyCode(email, code)
		setLoading(false)

		if (!res.success) {
			showError(res.message)
			return
		}

		showSuccess(res.message)
		setStep(3)
	}

	const validatePassword = () => {
		for (const rule of passwordRules) {
			if (!rule.test(password)) {
				setPasswordError(true)
				setPasswordErrorText(`Пароль должен содержать ${rule.text}`)
				return false
			}
		}
		if (password !== confirmPassword) {
			setPasswordError(true)
			setPasswordErrorText('Пароли не совпадают')
			setConfirmError(true)
			return false
		}
		setPasswordError(false)
		setPasswordErrorText('')
		setConfirmError(false)
		return true
	}

	const handleResetPassword = async () => {
		if (!validatePassword()) return
		setLoading(true)

		const res = await resetPassword(email, code, password, confirmPassword)
		setLoading(false)

		if (!res.success) {
			showError(res.message)
			return
		}

		showSuccess(res.message)
		handleCloseWrapped()
	}

	return (
		<Dialog.Root placement='center' open={open}>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='mx-4'>
					<Dialog.Header>
						<Dialog.Title>Сбросить пароль</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body>
						{step === 1 && (
							<Field.Root invalid={emailError} className='gap-3'>
								<Text>
									Введите адрес электронной почты вашего аккаунта, и мы отправим
									код подтверждения
								</Text>
								<Input
									value={email}
									onChange={e => {
										setEmail(e.target.value)
										if (emailError) setEmailError(false)
									}}
									type='email'
									name='email'
									placeholder='example@email.com'
									autoComplete='email'
									required
								/>
								{emailError && (
									<FieldErrorText>Введите корректный email</FieldErrorText>
								)}
							</Field.Root>
						)}

						{step === 2 && (
							<Field.Root invalid={codeError} className='gap-3'>
								<Text>Введите 6-значный код, отправленный на {email}</Text>
								<Input
									value={code}
									onChange={e => {
										setCode(e.target.value)
										if (codeError) setCodeError(false)
									}}
									placeholder='000000'
									maxLength={6}
									autoComplete='one-time-code'
									required
								/>
								{codeError && <FieldErrorText>Введите код</FieldErrorText>}
							</Field.Root>
						)}

						{step === 3 && (
							<Field.Root className='gap-4'>
								<Text>Придумайте новый пароль</Text>
								<Field.Root invalid={passwordError}>
									<Field.Label>Новый пароль</Field.Label>
									<PasswordInput
										value={password}
										onChange={e => {
											setPassword(e.target.value)
											if (passwordError) setPasswordError(false)
										}}
										placeholder='Новый пароль'
										autoComplete='new-password'
									/>
									{passwordError && (
										<FieldErrorText>{passwordErrorText}</FieldErrorText>
									)}
								</Field.Root>
								<Field.Root invalid={confirmError}>
									<Field.Label>Подтвердите пароль</Field.Label>
									<PasswordInput
										value={confirmPassword}
										onChange={e => {
											setConfirmPassword(e.target.value)
											if (confirmError) setConfirmError(false)
										}}
										placeholder='Повторите пароль'
										autoComplete='new-password'
									/>
									{confirmError && (
										<FieldErrorText>Пароли не совпадают</FieldErrorText>
									)}
								</Field.Root>
							</Field.Root>
						)}
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button variant='ghost' onClick={handleCloseWrapped}>
								Отмена
							</Button>
						</Dialog.ActionTrigger>

						{step === 1 && (
							<Button type='submit' onClick={handleSendCode} loading={loading}>
								Отправить код
							</Button>
						)}
						{step === 2 && (
							<Button
								type='submit'
								onClick={handleVerifyCode}
								loading={loading}
							>
								Подтвердить
							</Button>
						)}
						{step === 3 && (
							<Button
								type='submit'
								onClick={handleResetPassword}
								loading={loading}
							>
								Сохранить
							</Button>
						)}
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default ForgotPasswordModal
