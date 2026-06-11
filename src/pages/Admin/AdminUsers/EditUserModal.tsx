import { useEffect, useState } from 'react'
import {
	Button,
	CloseButton,
	Dialog,
	Field,
	Input,
	Select,
	Text,
	type ListCollection,
} from '@chakra-ui/react'
import { showSuccess, showError } from '@/shared/utils/toast'
import { updateUser } from '@/services/users'
import type { UserResponse } from '@/shared/types/user'

type Item = { value: string; label: string }

interface Props {
	user: UserResponse
	groupCollection: ListCollection<Item>
	onClose: () => void
	onUpdated: () => void
}

export function EditUserModal({
	user,
	groupCollection,
	onClose,
	onUpdated,
}: Props) {
	const [surname, setSurname] = useState(user.surname)
	const [name, setName] = useState(user.name)
	const [patronymic, setPatronymic] = useState(user.patronymic)
	const [login, setLogin] = useState(user.login)
	const [email, setEmail] = useState(user.email)
	const [phone, setPhone] = useState(user.phone)
	const [groupId, setGroupId] = useState<number | null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		setSurname(user.surname)
		setName(user.name)
		setPatronymic(user.patronymic)
		setLogin(user.login)
		setEmail(user.email)
		setPhone(user.phone)
	}, [user])

	const handleSave = async () => {
		if (!surname.trim() || !name.trim() || !login.trim()) {
			showError('Заполните обязательные поля')
			return
		}
		setSaving(true)
		const result = await updateUser(user.id, {
			surname: surname.trim(),
			name: name.trim(),
			patronymic: patronymic.trim(),
			login: login.trim(),
			email,
			phone,
			photoPath: null,
			groupId: groupId ?? 0,
			curatorId: 0,
		})
		setSaving(false)
		if (result) {
			showSuccess('Пользователь обновлён')
			onUpdated()
		} else {
			showError('Ошибка при обновлении')
		}
	}

	return (
		<Dialog.Root
			open={true}
			onOpenChange={e => {
				if (!e.open) onClose()
			}}
			placement='center'
		>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Редактирование пользователя</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Field.Root>
							<Text className='font-bold'>Фамилия</Text>
							<Input
								value={surname}
								onChange={e => setSurname(e.target.value)}
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Имя</Text>
							<Input value={name} onChange={e => setName(e.target.value)} />
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Отчество</Text>
							<Input
								value={patronymic}
								onChange={e => setPatronymic(e.target.value)}
							/>
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Логин</Text>
							<Input value={login} onChange={e => setLogin(e.target.value)} />
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Email</Text>
							<Input value={email} onChange={e => setEmail(e.target.value)} />
						</Field.Root>
						<Field.Root>
							<Text className='font-bold'>Телефон</Text>
							<Input value={phone} onChange={e => setPhone(e.target.value)} />
						</Field.Root>
						{user.role === 'Student' && (
							<Field.Root>
								<Select.Root
									collection={groupCollection}
									value={groupId ? [String(groupId)] : []}
									onValueChange={v => setGroupId(Number(v.value))}
								>
									<Select.HiddenSelect />
									<Select.Label>Группа</Select.Label>
									<Select.Control>
										<Select.Trigger className='cursor-pointer'>
											<Select.ValueText
												placeholder={
													user.groupDisplayName || 'Выберите группу'
												}
											/>
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
						<Button variant='ghost' onClick={onClose}>
							Отмена
						</Button>
						<Button onClick={handleSave} loading={saving}>
							Сохранить
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
