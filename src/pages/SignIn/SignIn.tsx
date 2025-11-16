import { ColorModeButton } from '@/components/ui/color-mode'
import { login } from '@/services/auth'
import {
	Button,
	Card,
	Checkbox,
	Field,
	Input,
	Link,
	Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn() {
	const [loginValue, setLoginValue] = useState('')
	const [password, setPasswordValue] = useState('')
	const navigate = useNavigate()

	const submit = async () => {
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
							<Field.Root>
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
							</Field.Root>
							<Field.Root>
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
						<Button type='submit' onClick={submit} className='button w-full'>
							Войти
						</Button>
						<Link href='#' className='flex'>
							Забыли пароль?
						</Link>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	)
}

export default SignIn
