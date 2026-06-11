import { useEffect, useState } from 'react'
import {
	Button,
	Text,
	Tabs,
	Table,
	createListCollection,
} from '@chakra-ui/react'
import AdminLayout from '../AdminLayout'
import { showSuccess, showError } from '@/shared/utils/toast'
import {
	getActiveUsers,
	getGraduatedUsers,
	deleteUser,
} from '@/services/users'
import { getGroups } from '@/services/directory'
import type { UserResponse } from '@/shared/types/user'
import type { GroupResponse } from '@/shared/types/group'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { UserRoleBadge } from '@/components/UserRoleBadge'
import { ConfirmModal } from '@/components/ConfirmModal'
import { CreateUserModal } from './CreateUserModal'
import { EditUserModal } from './EditUserModal'

type Item = { value: string; label: string }

function AdminUsersPage() {
	const [activeUsers, setActiveUsers] = useState<UserResponse[]>([])
	const [graduatedUsers, setGraduatedUsers] = useState<UserResponse[]>([])
	const [groups, setGroups] = useState<Item[]>([])
	const [tab, setTab] = useState('active')
	const [loading, setLoading] = useState(true)
	const [editUser, setEditUser] = useState<UserResponse | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null)

	const fetchData = async () => {
		setLoading(true)
		const [active, graduated, groupsData] = await Promise.all([
			getActiveUsers(),
			getGraduatedUsers(),
			getGroups(),
		])
		setActiveUsers(active)
		setGraduatedUsers(graduated)
		setGroups(
			groupsData.map((g: GroupResponse) => ({
				value: String(g.id),
				label: g.name,
			})),
		)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const handleDelete = async () => {
		if (!deleteTarget) return
		const ok = await deleteUser(deleteTarget.id)
		if (ok) {
			showSuccess('Пользователь удалён')
			setDeleteTarget(null)
			fetchData()
		} else {
			showError('Ошибка при удалении')
		}
	}

	const groupCollection = createListCollection({ items: groups })

	const users = tab === 'active' ? activeUsers : graduatedUsers

	return (
		<AdminLayout>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-2xl'>Управление пользователями</h3>
				<CreateUserModal
					groupCollection={groupCollection}
					onCreated={fetchData}
				/>
			</div>

			<Tabs.Root value={tab} onValueChange={e => setTab(e.value)} mb={6}>
				<Tabs.List>
					<Tabs.Trigger value='active' className='cursor-pointer'>
						Активные
					</Tabs.Trigger>
					<Tabs.Trigger value='graduated' className='cursor-pointer'>
						Выпустившиеся
					</Tabs.Trigger>
					<Tabs.Indicator />
				</Tabs.List>
			</Tabs.Root>

			{loading ? (
				<Text className='text-center py-16 text-gray-500'>Загрузка...</Text>
			) : users.length === 0 ? (
				<Text className='text-center py-16 text-gray-500'>
					Пользователи не найдены
				</Text>
			) : (
				<Table.ScrollArea className='h-170' borderWidth='1px'>
					<Table.Root showColumnBorder stickyHeader interactive>
						<Table.Header>
							<Table.Row bg='bg.subtle'>
								<Table.ColumnHeader>ID</Table.ColumnHeader>
								<Table.ColumnHeader>ФИО</Table.ColumnHeader>
								<Table.ColumnHeader>Логин</Table.ColumnHeader>
								<Table.ColumnHeader>Почта</Table.ColumnHeader>
								<Table.ColumnHeader>Телефон</Table.ColumnHeader>
								<Table.ColumnHeader>Роль</Table.ColumnHeader>
								<Table.ColumnHeader>Группа</Table.ColumnHeader>
								<Table.ColumnHeader className='w-5'>
									Действия
								</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{users.map(u => (
								<Table.Row key={u.id}>
									<Table.Cell>{u.id}</Table.Cell>
									<Table.Cell>
										{u.surname} {u.name} {u.patronymic}
									</Table.Cell>
									<Table.Cell>{u.login}</Table.Cell>
									<Table.Cell>{u.email}</Table.Cell>
									<Table.Cell>{u.phone}</Table.Cell>
									<Table.Cell>
										<UserRoleBadge
											role={
												u.role === 'Student'
													? 'Студент'
													: u.role === 'Teacher'
														? 'Преподаватель'
														: 'Админ'
											}
										/>
									</Table.Cell>
									<Table.Cell>{u.groupDisplayName || '—'}</Table.Cell>
									<Table.Cell>
										<div className='flex gap-2'>
											<Button
												size='sm'
												variant='surface'
												colorPalette='blue'
												onClick={() => setEditUser(u)}
											>
												<LuPencil />
											</Button>
											<Button
												size='sm'
												variant='surface'
												colorPalette='red'
												onClick={() => setDeleteTarget(u)}
											>
												<LuTrash2 />
											</Button>
										</div>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
			)}

			<ConfirmModal
				isOpen={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={handleDelete}
				title='Удаление пользователя'
				message='Вы уверены, что хотите удалить пользователя? Это действие нельзя отменить.'
				confirmText='Удалить'
				confirmColor='red'
			/>

			{editUser && (
				<EditUserModal
					user={editUser}
					groupCollection={groupCollection}
					onClose={() => setEditUser(null)}
					onUpdated={() => {
						setEditUser(null)
						fetchData()
					}}
				/>
			)}
		</AdminLayout>
	)
}

export default AdminUsersPage
