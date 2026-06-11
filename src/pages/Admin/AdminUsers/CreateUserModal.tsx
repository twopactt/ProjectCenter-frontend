import { useState } from 'react'
import {
	Button,
	CloseButton,
	Dialog,
	Field,
	Input,
	Select,
	Text,
	createListCollection,
	type ListCollection,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { createUser } from '@/services/users'

type Item = { value: string; label: string }

const roleOptions: Item[] = [
	{ value: 'Student', label: 'Студент' },
	{ value: 'Teacher', label: 'Преподаватель' },
	{ value: 'Admin', label: 'Админ' },
]

interface Props {
	groupCollection: ListCollection<Item>
	onCreated: () => void
}

export function CreateUserModal({ groupCollection, onCreated }: Props) {
	const [open, setOpen] = useState(false)
	const [role, setRole] = useState('Student')
	const [surname, setSurname] = useState('')
	const [name, setName] = useState('')
	const [patronymic, setPatronymic] = useState('')
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [groupId, setGroupId] = useState<number | null>(null)
	const [creating, setCreating] = useState(false)

	const reset = () => {
		setRole('Student')
		setSurname('')
		setName('')
		setPatronymic('')
		setLogin('')
		setPassword('')
		setPhone('')
		setEmail('')
		setGroupId(null)
	}

	const handleCreate = async () => {
		if (!surname.trim() || !name.trim() || !login.trim() || !password.trim()) {
			showError('Заполните обязательные поля')
			return
		}
		setCreating(true)
		const result = await createUser({
			role,
			surname: surname.trim(),
			name: name.trim(),
			patronymic: patronymic.trim(),
			login: login.trim(),
			password,
			phone,
			email,
			photo: null,
			groupId: groupId ?? 0,
			teacherId: 0,
		})
		setCreating(false)
		if (result) {
			showSuccess('Пользователь создан')
			setOpen(false)
			reset()
			onCreated()
		} else {
			showError('Ошибка при создании пользователя')
		}
	}

	const roleCollection = createListCollection({ items: roleOptions })

	return (
		<Dialog.Root
			open={open}
			onOpenChange={e => setOpen(e.open)}
			placement='center'
		>
			<Dialog.Trigger asChild>
				<Button className='cursor-pointer' onClick={() => setOpen(true)}>
					Создать
				</Button>
			</Dialog.Trigger>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Создание пользователя</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Field.Root>
							<Select.Root
								collection={roleCollection}
								value={[role]}
								onValueChange={v => setRole(v.value[0])}
							>
								<Select.HiddenSelect />
								<Select.Label>Роль</Select.Label>
								<Select.Control>
									<Select.Trigger className='cursor-pointer'>
										<Select.ValueText placeholder='Выберите роль' />
									</Select.Trigger>
									<Select.IndicatorGroup>
										<Select.Indicator />
									</Select.IndicatorGroup>
								</Select.Control>
								<Select.Positioner>
									<Select.Content>
										{roleOptions.map(r => (
											<Select.Item
												item={r}
												key={r.value}
												className='cursor-pointer'
											>
												{r.label}
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Select.Root>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Фамилия</Text>
							<Input
								value={surname}
								onChange={e => setSurname(e.target.value)}
								placeholder='Фамилия'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Имя</Text>
							<Input
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder='Имя'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Отчество</Text>
							<Input
								value={patronymic}
								onChange={e => setPatronymic(e.target.value)}
								placeholder='Отчество'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Логин</Text>
							<Input
								value={login}
								onChange={e => setLogin(e.target.value)}
								placeholder='Логин'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Пароль</Text>
							<Input
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder='Пароль'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Телефон</Text>
							<Input
								value={phone}
								onChange={e => setPhone(e.target.value)}
								placeholder='+7XXXXXXXXXX'
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Email</Text>
							<Input
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder='email@example.com'
							/>
						</Field.Root>
						{role === 'Student' && (
							<Field.Root>
								<Select.Root
									collection={groupCollection}
									onValueChange={v => setGroupId(Number(v.value))}
								>
									<Select.HiddenSelect />
									<Select.Label>Группа</Select.Label>
									<Select.Control>
										<Select.Trigger className='cursor-pointer'>
											<Select.ValueText placeholder='Выберите группу' />
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Select.Positioner>
										<Select.Content>
											{groupCollection.items.map(g => (
												<Select.Item
													item={g}
													key={g.value}
													className='cursor-pointer'
												>
													{g.label}
													<Select.ItemIndicator />
												</Select.Item>
											))}
										</Select.Content>
									</Select.Positioner>
								</Select.Root>
							</Field.Root>
						)}
					</Dialog.Body>
					<Dialog.Footer>
						<Button
							variant='ghost'
							onClick={() => {
								reset()
								setOpen(false)
							}}
						>
							Отмена
						</Button>
						<Button onClick={handleCreate} loading={creating}>
							Создать
						</Button>
						<Dialog.CloseTrigger asChild>
							<CloseButton size='sm' />
						</Dialog.CloseTrigger>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}
