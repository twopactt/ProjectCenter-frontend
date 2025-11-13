import { ColorModeButton } from '@/components/ui/color-mode'
import {
	Button,
	Card,
	Checkbox,
	Field,
	Input,
	Link,
	Stack,
} from '@chakra-ui/react'

function SignIn() {
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
									type='password'
									name='password'
									autoComplete='login'
									autoFocus
									required
									placeholder='••••••••'
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
						<Button type='submit' className='button w-full'>
							Войти
						</Button>
						<Link href='/projects' className='flex'>
							Забыли пароль?
						</Link>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	)
}

export default SignIn
