import { useMemo, useState } from 'react'
import {
	Button,
	Combobox,
	createListCollection,
	Dialog,
	Field,
	Input,
	Portal,
	Select,
	useFilter,
	FieldErrorText,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { createUser } from '@/services/users'
import type { GroupResponse } from '@/shared/types/group'
import type { TeacherResponse } from '@/shared/types/teacher'
import { PasswordInput } from '@/components/ui/password-input'

interface Props {
	groups: GroupResponse[]
	teachers: TeacherResponse[]
	onCreated: () => void
}

const roleOptions = [
	{ value: 'Student', label: 'Студент' },
	{ value: 'Teacher', label: 'Преподаватель' },
	{ value: 'Admin', label: 'Админ' },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const phoneRegex = /^(\+7|8)\d{10}$/

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

const roleCollection = createListCollection({ items: roleOptions })

function CreateUserModal({ groups, teachers, onCreated }: Props) {
	const { contains } = useFilter({ sensitivity: 'base' })

	const [open, setOpen] = useState(false)
	const [teacherSearch, setTeacherSearch] = useState('')

	const [role, setRole] = useState('Student')

	const [surname, setSurname] = useState('')
	const [surnameError, setSurnameError] = useState(false)

	const [name, setName] = useState('')
	const [nameError, setNameError] = useState(false)

	const [patronymic, setPatronymic] = useState('')

	const [login, setLogin] = useState('')
	const [loginError, setLoginError] = useState(false)

	const [password, setPassword] = useState('')
	const [passwordError, setPasswordError] = useState(false)

	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [emailErrorMessage, setEmailErrorMessage] = useState('')

	const [phone, setPhone] = useState('')
	const [phoneError, setPhoneError] = useState(false)
	const [phoneErrorMessage, setPhoneErrorMessage] = useState('')

	const [groupId, setGroupId] = useState('')
	const [groupError, setGroupError] = useState(false)

	const [teacherId, setTeacherId] = useState('')
	const [teacherError, setTeacherError] = useState(false)

	const [creating, setCreating] = useState(false)

	const resetForm = () => {
		setRole('Student')
		setSurname('')
		setSurnameError(false)
		setName('')
		setNameError(false)
		setPatronymic('')
		setLogin('')
		setLoginError(false)
		setPassword('')
		setPasswordError(false)
		setEmail('')
		setEmailError(false)
		setEmailErrorMessage('')
		setPhone('')
		setPhoneError(false)
		setPhoneErrorMessage('')
		setGroupId('')
		setGroupError(false)
		setTeacherId('')
		setTeacherError(false)
		setTeacherSearch('')
	}

	const groupCollection = useMemo(
		() =>
			createListCollection({
				items: groups.map(g => ({
					value: String(g.id),
					label: g.name,
				})),
			}),
		[groups],
	)

	const teacherItems = useMemo(
		() =>
			teachers.map(t => ({
				value: String(t.id),
				label: `${t.surname} ${t.name}${t.patronymic ? ' ' + t.patronymic : ''}`,
			})),
		[teachers],
	)

	const teacherCollection = useMemo(
		() =>
			createListCollection({
				items: teacherSearch
					? teacherItems.filter(item => contains(item.label, teacherSearch))
					: teacherItems,
			}),
		[teacherItems, teacherSearch, contains],
	)

	const validate = () => {
		let valid = true

		if (!surname.trim()) {
			setSurnameError(true)
			valid = false
		} else {
			setSurnameError(false)
		}

		if (!name.trim()) {
			setNameError(true)
			valid = false
		} else {
			setNameError(false)
		}

		if (!login.trim()) {
			setLoginError(true)
			valid = false
		} else {
			setLoginError(false)
		}

		const failedRules = passwordRules.filter(r => !r.test(password))
		if (failedRules.length > 0) {
			setPasswordError(true)
			valid = false
		} else {
			setPasswordError(false)
		}

		if (!phone.trim()) {
			setPhoneError(true)
			setPhoneErrorMessage('Обязательное поле')
			valid = false
		} else if (!phoneRegex.test(phone)) {
			setPhoneError(true)
			setPhoneErrorMessage('Используйте формат +7XXXXXXXXXX или 8XXXXXXXXXX')
			valid = false
		} else {
			setPhoneError(false)
			setPhoneErrorMessage('')
		}

		if (!email.trim()) {
			setEmailError(true)
			setEmailErrorMessage('Обязательное поле')
			valid = false
		} else if (!emailRegex.test(email)) {
			setEmailError(true)
			setEmailErrorMessage('Некорректный формат email')
			valid = false
		} else {
			setEmailError(false)
			setEmailErrorMessage('')
		}

		if (role === 'Student') {
			if (!groupId) {
				setGroupError(true)
				valid = false
			} else {
				setGroupError(false)
			}
			if (!teacherId) {
				setTeacherError(true)
				valid = false
			} else {
				setTeacherError(false)
			}
		}

		return valid
	}

	const handleCreate = async () => {
		if (!validate()) {
			showError('Заполните все обязательные поля')
			return
		}
		setCreating(true)
		const payload: Parameters<typeof createUser>[0] = {
			role,
			surname: surname.trim(),
			name: name.trim(),
			patronymic: patronymic.trim(),
			login: login.trim(),
			password,
			phone,
			email,
			photo: null,
			groupId: role === 'Student' ? Number(groupId) : 0,
			teacherId: role === 'Student' ? Number(teacherId) : 0,
			dateEnrolled: new Date().toISOString(),
		}
		const result = await createUser(payload)
		setCreating(false)
		if ('data' in result) {
			showSuccess('Пользователь создан')
			setOpen(false)
			resetForm()
			onCreated()
		} else {
			showError(result.error)
		}
	}

	return (
		<Dialog.Root open={open} placement='center' scrollBehavior='inside'>
			<Dialog.Trigger asChild>
				<Button className='cursor-pointer' onClick={() => setOpen(true)}>
					Создать
				</Button>
			</Dialog.Trigger>
			<Portal>
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
									onValueChange={v => {
										setRole(v.value[0])
										setGroupId('')
										setTeacherId('')
										setGroupError(false)
										setTeacherError(false)
									}}
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
									<Portal>
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
									</Portal>
								</Select.Root>
							</Field.Root>

							<Field.Root invalid={surnameError}>
								<Field.Label className='font-bold'>Фамилия</Field.Label>
								<Input
									placeholder='Фамилия'
									value={surname}
									onChange={e => {
										setSurname(e.target.value)
										if (surnameError) setSurnameError(false)
									}}
								/>
								{surnameError && (
									<FieldErrorText>Обязательное поле</FieldErrorText>
								)}
							</Field.Root>

							<Field.Root invalid={nameError}>
								<Field.Label className='font-bold'>Имя</Field.Label>
								<Input
									placeholder='Имя'
									value={name}
									onChange={e => {
										setName(e.target.value)
										if (nameError) setNameError(false)
									}}
								/>
								{nameError && (
									<FieldErrorText>Обязательное поле</FieldErrorText>
								)}
							</Field.Root>

							<Field.Root>
								<Field.Label className='font-bold'>Отчество</Field.Label>
								<Input
									placeholder='Отчество'
									value={patronymic}
									onChange={e => setPatronymic(e.target.value)}
								/>
							</Field.Root>

							<Field.Root invalid={loginError}>
								<Field.Label className='font-bold'>Логин</Field.Label>
								<Input
									placeholder='Логин'
									value={login}
									onChange={e => {
										setLogin(e.target.value)
										if (loginError) setLoginError(false)
									}}
								/>
								{loginError && (
									<FieldErrorText>Обязательное поле</FieldErrorText>
								)}
							</Field.Root>

							<Field.Root invalid={passwordError}>
								<Field.Label className='font-bold'>Пароль</Field.Label>
								<PasswordInput
									type='password'
									placeholder='Пароль'
									value={password}
									onChange={e => {
										setPassword(e.target.value)
										if (passwordError) {
											setPasswordError(
												passwordRules.filter(r => !r.test(e.target.value))
													.length > 0,
											)
										}
									}}
								/>
								{(passwordError || password.length > 0) && (
									<ul className='text-xs mt-1 space-y-0.5'>
										{passwordRules.map((rule, i) => {
											const pass = rule.test(password)
											return (
												<li
													key={i}
													className={pass ? 'text-green-600' : 'text-red-500'}
												>
													{pass ? '✓' : '✗'} {rule.text}
												</li>
											)
										})}
									</ul>
								)}
							</Field.Root>

							<Field.Root invalid={phoneError}>
								<Field.Label className='font-bold'>Телефон</Field.Label>
								<Input
									placeholder='+7XXXXXXXXXX или 8XXXXXXXXXX'
									value={phone}
									onChange={e => {
										setPhone(e.target.value)
										if (phoneError) {
											if (!e.target.value || phoneRegex.test(e.target.value)) {
												setPhoneError(false)
												setPhoneErrorMessage('')
											}
										}
									}}
								/>
								{phoneError && (
									<FieldErrorText>{phoneErrorMessage}</FieldErrorText>
								)}
							</Field.Root>

							<Field.Root invalid={emailError}>
								<Field.Label className='font-bold'>Email</Field.Label>
								<Input
									placeholder='email@example.com'
									value={email}
									type='email'
									onChange={e => {
										setEmail(e.target.value)
										if (emailError) {
											if (!e.target.value || emailRegex.test(e.target.value)) {
												setEmailError(false)
												setEmailErrorMessage('')
											}
										}
									}}
								/>
								{emailError && (
									<FieldErrorText>{emailErrorMessage}</FieldErrorText>
								)}
							</Field.Root>

							{role === 'Student' && (
								<>
									<Field.Root invalid={groupError}>
										<Select.Root
											collection={groupCollection}
											value={groupId ? [groupId] : []}
											onValueChange={e => {
												setGroupId(e.value?.[0] ?? '')
												if (groupError) setGroupError(false)
											}}
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
											<Portal>
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
											</Portal>
										</Select.Root>
										{groupError && (
											<FieldErrorText>Выберите группу</FieldErrorText>
										)}
									</Field.Root>

									<Field.Root invalid={teacherError}>
										<Combobox.Root
											collection={teacherCollection}
											value={teacherId ? [teacherId] : []}
											onValueChange={e => {
												setTeacherId(e.value?.[0] ?? '')
												if (teacherError) setTeacherError(false)
											}}
											onInputValueChange={({ inputValue }) =>
												setTeacherSearch(inputValue)
											}
										>
											<Combobox.Label>Преподаватель</Combobox.Label>
											<Combobox.Control>
												<Combobox.Input placeholder='Поиск преподавателя...' />
												<Combobox.IndicatorGroup>
													<Combobox.ClearTrigger />
													<Combobox.Trigger />
												</Combobox.IndicatorGroup>
											</Combobox.Control>
											<Portal>
												<Combobox.Positioner>
													<Combobox.Content>
														<Combobox.Empty>
															Преподаватель не найден
														</Combobox.Empty>
														{teacherCollection.items.map(item => (
															<Combobox.Item item={item} key={item.value}>
																{item.label}
																<Combobox.ItemIndicator />
															</Combobox.Item>
														))}
													</Combobox.Content>
												</Combobox.Positioner>
											</Portal>
										</Combobox.Root>
										{teacherError && (
											<FieldErrorText>Выберите преподавателя</FieldErrorText>
										)}
									</Field.Root>
								</>
							)}
						</Dialog.Body>
						<Dialog.Footer>
							<Button
								variant='ghost'
								onClick={() => {
									resetForm()
									setOpen(false)
								}}
							>
								Отмена
							</Button>
							<Button onClick={handleCreate} loading={creating}>
								Создать
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export default CreateUserModal
