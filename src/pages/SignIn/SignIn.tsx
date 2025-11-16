import { ColorModeButton } from '@/components/ui/color-mode'
import { login } from '@/services/auth'
import {
	Button,
	Card,
	Checkbox,
	Field,
	FieldErrorText,
	Input,
	Link,
	Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ForgotPassword from './ForgotPassword'

function SignIn() {
	const [loginValue, setLoginValue] = useState('')
	const [loginError, setLoginError] = useState(false)
	const [loginErrorMessage, setLoginErrorMessage] = useState('')
	const [password, setPasswordValue] = useState('')
	const [passwordError, setPasswordError] = useState(false)
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const validateInputs = () => {
		let isValid = true

		if (!loginValue) {
			setLoginError(true)
			setLoginErrorMessage('Пожалуйста, введите корректный логин.')
			isValid = false
		} else {
			setLoginError(false)
			setLoginErrorMessage('')
		}

		if (!password) {
			setPasswordError(true)
			setPasswordErrorMessage('Пожалуйста, введите пароль.')
			isValid = false
		} else {
			setPasswordError(false)
			setPasswordErrorMessage('')
		}

		return isValid
	}

	const handleSubmit = async () => {
		if (!validateInputs()) return

		const result = await login({
			login: loginValue,
			password: password,
		})

		if (!result) {
			alert('Неверный логин или пароль.')
			return
		}

		navigate('/projects')
	}

	return (
		<div>
			<ColorModeButton className='fixed top-3 right-3 z-10' />
			<div className='flex justify-center w-screen h-screen'>
				<Card.Root className='max-w-md w-full self-center'>
					<Card.Header>
						<Card.Title className='font-bold text-xl'>Войти</Card.Title>
					</Card.Header>
					<Card.Body>
						<Stack className='!gap-4 w-full'>
							<Field.Root invalid={loginError}>
								<Field.Label>Логин</Field.Label>
								<Input
									value={loginValue}
									onChange={e => setLoginValue(e.target.value)}
									type='login'
									name='login'
									placeholder='login'
									autoComplete='login'
									autoFocus
									required
								/>
								{loginError && (
									<FieldErrorText>{loginErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root invalid={passwordError}>
								<Field.Label>Пароль</Field.Label>
								<Input
									value={password}
									onChange={e => setPasswordValue(e.target.value)}
									type='password'
									name='password'
									placeholder='••••••••'
									autoComplete='password'
									required
								/>
								{passwordError && (
									<FieldErrorText>{passwordErrorMessage}</FieldErrorText>
								)}
							</Field.Root>
							<Field.Root>
								<Checkbox.Root>
									<Checkbox.HiddenInput />
									<Checkbox.Control />
									<Checkbox.Label>Запомнить меня</Checkbox.Label>
								</Checkbox.Root>
							</Field.Root>
						</Stack>
					</Card.Body>
					<Card.Footer className='justify-center flex flex-col gap-3'>
						<Button
							type='submit'
							onClick={handleSubmit}
							className='button w-full'
						>
							Войти
						</Button>
						<Link type='button' onClick={handleClickOpen} className='flex'>
							Забыли пароль?
						</Link>
						<ForgotPassword open={open} handleClose={handleClose} />
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	)
}

export default SignIn
