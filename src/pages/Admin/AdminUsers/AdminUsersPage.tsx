import { useEffect, useState } from 'react'
import { Text, Table, Tabs } from '@chakra-ui/react'
import AdminLayout from '../AdminLayout'
import { getActiveUsers, getGraduatedUsers } from '@/services/users'
import { getGroups } from '@/services/directory'
import { getTeachers } from '@/services/teachers'
import { useAuth } from '@/store/auth'
import type { UserResponse } from '@/shared/types/user'
import type { GroupResponse } from '@/shared/types/group'
import type { TeacherResponse } from '@/shared/types/teacher'
import CreateUserModal from './CreateUserModal'
import AdminUserCard from './AdminUserCard'

function AdminUsersPage() {
	const profile = useAuth(s => s.user)
	const [activeUsers, setActiveUsers] = useState<UserResponse[]>([])
	const [graduatedUsers, setGraduatedUsers] = useState<UserResponse[]>([])
	const [groups, setGroups] = useState<GroupResponse[]>([])
	const [teachers, setTeachers] = useState<TeacherResponse[]>([])
	const [tab, setTab] = useState('active')
	const [loading, setLoading] = useState(true)

	const fetchData = async () => {
		setLoading(true)
		const [active, graduated, groupsData, teachersData] = await Promise.all([
			getActiveUsers(),
			getGraduatedUsers(),
			getGroups(),
			getTeachers(),
		])
		setActiveUsers(active)
		setGraduatedUsers(graduated)
		setGroups(groupsData)
		setTeachers(teachersData)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const users = tab === 'active' ? activeUsers : graduatedUsers

	return (
		<AdminLayout>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-2xl'>Управление пользователями</h3>
				<CreateUserModal
					groups={groups}
					teachers={teachers}
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
								<AdminUserCard
									key={u.id}
									user={u}
									groups={groups}
									teachers={teachers}
									currentUserId={profile?.id ?? 0}
									showDelete={tab !== 'graduated'}
									onDeleted={fetchData}
									onUpdated={fetchData}
								/>
							))}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
			)}
		</AdminLayout>
	)
}

export default AdminUsersPage
