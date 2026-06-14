import { useEffect, useMemo, useState } from 'react'
import {
	Button,
	Combobox,
	DatePicker,
	Dialog,
	Field,
	Input,
	parseDate,
	Portal,
	Select,
	useListCollection,
	FieldErrorText,
	useFilter,
	createListCollection,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { updateUser } from '@/services/users'
import type { UpdateUserRequest, UserResponse } from '@/shared/types/user'
import type { TeacherResponse } from '@/shared/types/teacher'
import type { GroupResponse } from '@/shared/types/group'
import { LuCalendar } from 'react-icons/lu'

interface Props {
	isOpen: boolean
	user: UserResponse
	userId: number
	initialData: {
		surname: string
		name: string
		patronymic?: string | null
		login: string
		email: string
		phone: string
		groupId: number
		curatorId: number
		dateEnrolled: string
		dateGraduated: string
	}
	groups: GroupResponse[]
	teachers: TeacherResponse[]
	onClose: () => void
	onUpdated: (user: UpdateUserRequest) => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+7|8)\d{10}$/

function EditUserModal({
	isOpen,
	user,
	userId,
	initialData,
	teachers,
	groups,
	onClose,
	onUpdated,
}: Props) {
	const [surname, setSurname] = useState('')
	const [surnameError, setSurnameError] = useState(false)

	const [name, setName] = useState('')
	const [nameError, setNameError] = useState(false)

	const [patronymic, setPatronymic] = useState('')

	const [login, setLogin] = useState('')
	const [loginError, setLoginError] = useState(false)

	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [emailErrorMessage, setEmailErrorMessage] = useState('')

	const [phone, setPhone] = useState('')
	const [phoneError, setPhoneError] = useState(false)
	const [phoneErrorMessage, setPhoneErrorMessage] = useState('')

	const [groupId, setGroupId] = useState('')
	const [groupError, setGroupError] = useState(false)

	const [curatorId, setCuratorId] = useState('')
	const [curatorError, setCuratorError] = useState(false)

	const [dateEnrolled, setDateEnrolled] = useState('')
	const [dateEnrolledError, setDateEnrolledError] = useState(false)
	const [dateEnrolledErrorMessage, setDateEnrolledErrorMessage] = useState('')

	const [dateGraduated, setDateGraduated] = useState('')
	const [dateGraduatedError, setDateGraduatedError] = useState(false)
	const [dateGraduatedErrorMessage, setDateGraduatedErrorMessage] = useState('')

	const isStudent = user.role === 'Student'

	useEffect(() => {
		if (isOpen && initialData) {
			setSurname(initialData.surname || '')
			setName(initialData.name || '')
			setPatronymic(initialData.patronymic || '')
			setLogin(initialData.login || '')
			setEmail(initialData.email || '')
			setPhone(initialData.phone || '')
			setGroupId(initialData.groupId?.toString() || '')
			setCuratorId(initialData.curatorId?.toString() || '')
			setDateEnrolled(initialData.dateEnrolled || '')
			setDateGraduated(initialData.dateGraduated || '')

			setSurnameError(false)
			setNameError(false)
			setLoginError(false)
			setEmailError(false)
			setEmailErrorMessage('')
			setPhoneError(false)
			setPhoneErrorMessage('')
			setGroupError(false)
			setCuratorError(false)
			setDateEnrolledError(false)
			setDateEnrolledErrorMessage('')
			setDateGraduatedError(false)
			setDateGraduatedErrorMessage('')
		}
	}, [isOpen, userId])

	const { contains } = useFilter({ sensitivity: 'base' })

	const teacherItems = useMemo(
		() =>
			teachers.map(t => ({
				value: t.id.toString(),
				label: `${t.surname} ${t.name} ${t.patronymic ?? ''}`,
			})),
		[teachers],
	)

	const { collection: teacherCollection, filter: filterTeacher } =
		useListCollection({
			initialItems: teacherItems,
			filter: contains,
		})

	const groupCollection = useMemo(
		() =>
			createListCollection({
				items: groups.map(s => ({
					value: s.id.toString(),
					label: s.name,
				})),
			}),
		[groups],
	)

	const selectedGroupLabel =
		groupCollection.items.find(i => i.value === groupId)?.label || ''

	const getDateEnrolledValue = () => {
		if (!dateEnrolled) return []
		try {
			return [parseDate(dateEnrolled)]
		} catch {
			return []
		}
	}

	const getDateGraduatedValue = () => {
		if (!dateGraduated) return []
		try {
			return [parseDate(dateGraduated)]
		} catch {
			return []
		}
	}

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

		if (isStudent) {
			if (!groupId) {
				setGroupError(true)
				valid = false
			} else {
				setGroupError(false)
			}
			if (!curatorId) {
				setCuratorError(true)
				valid = false
			} else {
				setCuratorError(false)
			}
		}

		return valid
	}

	const handleSave = async () => {
		if (!validate()) {
			showError('Заполните все поля')
			return
		}

		const toValidISO = (s: string) => {
			if (!s) return undefined
			const d = new Date(s)
			return isNaN(d.getTime()) ? undefined : d.toISOString()
		}

		const data: UpdateUserRequest = {
			surname: surname.trim(),
			name: name.trim(),
			patronymic: patronymic.trim(),
			login: login.trim(),
			email,
			phone,
			photoPath: null,
			groupId: isStudent ? Number(groupId) : 0,
			curatorId: isStudent ? Number(curatorId) : 0,
			dateEnrolled: isStudent ? toValidISO(dateEnrolled) : undefined,
			dateGraduated: isStudent
				? dateGraduated
					? toValidISO(dateGraduated)
					: null
				: undefined,
		}

		const updated = await updateUser(userId, data)

		if ('data' in updated) {
			showSuccess('Пользователь успешно обновлён')
			onUpdated(data)
			onClose()
		} else {
			showError(updated.error)
		}
	}

	return (
		<Dialog.Root open={isOpen} placement='center' scrollBehavior='inside'>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
						<Dialog.Header>
							<Dialog.Title>Редактирование пользователя</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body className='flex flex-col gap-4'>
							<Field.Root invalid={surnameError}>
								<Field.Label className='font-bold'>Фамилия</Field.Label>
								<Input
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
									value={patronymic}
									onChange={e => setPatronymic(e.target.value)}
								/>
							</Field.Root>

							<Field.Root invalid={loginError}>
								<Field.Label className='font-bold'>Логин</Field.Label>
								<Input
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

							<Field.Root invalid={emailError}>
								<Field.Label className='font-bold'>Email</Field.Label>
								<Input
									value={email}
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

							<Field.Root invalid={phoneError}>
								<Field.Label className='font-bold'>Телефон</Field.Label>
								<Input
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

							{isStudent && (
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
													<Select.ValueText>
														{selectedGroupLabel || 'Выберите группу'}
													</Select.ValueText>
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

									<Field.Root invalid={curatorError}>
										<Combobox.Root
											collection={teacherCollection}
											value={curatorId ? [curatorId] : []}
											onValueChange={e => {
												setCuratorId(e.value?.[0] ?? '')
												if (curatorError) setCuratorError(false)
											}}
											onInputValueChange={({ inputValue }) =>
												filterTeacher(inputValue)
											}
										>
											<Combobox.Label>Куратор</Combobox.Label>
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
										{curatorError && (
											<FieldErrorText>Выберите преподавателя</FieldErrorText>
										)}
									</Field.Root>

									<Field.Root>
										<DatePicker.Root
											locale='ru-RU'
											value={getDateEnrolledValue()}
											format={date => date.toString()}
											onValueChange={e => {
												if (e.value?.[0]) {
													setDateEnrolled(e.value[0].toString())
												}
											}}
										>
											<DatePicker.Label>Дата зачисления</DatePicker.Label>
											<DatePicker.Control>
												<DatePicker.Input readOnly />
												<DatePicker.IndicatorGroup>
													<DatePicker.Trigger>
														<LuCalendar />
													</DatePicker.Trigger>
												</DatePicker.IndicatorGroup>
											</DatePicker.Control>
											<Portal>
												<DatePicker.Positioner>
													<DatePicker.Content>
														<DatePicker.View view='day'>
															<DatePicker.Header />
															<DatePicker.DayTable />
														</DatePicker.View>
														<DatePicker.View view='month'>
															<DatePicker.Header />
															<DatePicker.MonthTable />
														</DatePicker.View>
														<DatePicker.View view='year'>
															<DatePicker.Header />
															<DatePicker.YearTable />
														</DatePicker.View>
													</DatePicker.Content>
												</DatePicker.Positioner>
											</Portal>
										</DatePicker.Root>
										{dateEnrolledError && (
											<FieldErrorText>
												{dateEnrolledErrorMessage}
											</FieldErrorText>
										)}
									</Field.Root>

									<Field.Root>
										<DatePicker.Root
											locale='ru-RU'
											value={getDateGraduatedValue()}
											min={dateEnrolled ? parseDate(dateEnrolled) : undefined}
											format={date => date.toString()}
											onValueChange={e => {
												if (e.value?.[0]) {
													setDateGraduated(e.value[0].toString())
												} else {
													setDateGraduated('')
												}
											}}
										>
											<DatePicker.Label>Дата выпуска</DatePicker.Label>
											<DatePicker.Control>
												<DatePicker.Input readOnly />
												<DatePicker.IndicatorGroup>
													<DatePicker.Trigger>
														<LuCalendar />
													</DatePicker.Trigger>
												</DatePicker.IndicatorGroup>
											</DatePicker.Control>
											<Portal>
												<DatePicker.Positioner>
													<DatePicker.Content>
														<DatePicker.View view='day'>
															<DatePicker.Header />
															<DatePicker.DayTable />
														</DatePicker.View>
														<DatePicker.View view='month'>
															<DatePicker.Header />
															<DatePicker.MonthTable />
														</DatePicker.View>
														<DatePicker.View view='year'>
															<DatePicker.Header />
															<DatePicker.YearTable />
														</DatePicker.View>
													</DatePicker.Content>
												</DatePicker.Positioner>
											</Portal>
										</DatePicker.Root>
										{dateGraduatedError && (
											<FieldErrorText>
												{dateGraduatedErrorMessage}
											</FieldErrorText>
										)}
									</Field.Root>
								</>
							)}
						</Dialog.Body>
						<Dialog.Footer>
							<Button variant='ghost' onClick={onClose}>
								Отмена
							</Button>
							<Button onClick={handleSave}>Сохранить</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export default EditUserModal
