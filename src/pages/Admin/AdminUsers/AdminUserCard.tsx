import { useState } from 'react'
import { Button, Table } from '@chakra-ui/react'
import type { UpdateUserRequest, UserResponse } from '@/shared/types/user'
import type { TeacherResponse } from '@/shared/types/teacher'
import type { GroupResponse } from '@/shared/types/group'
import { UserRoleBadge } from '@/components/UserRoleBadge'
import { ConfirmModal } from '@/components/ConfirmModal'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { deleteUser } from '@/services/users'
import { showSuccess, showError } from '@/shared/utils/toast'
import EditUserModal from './EditUserModal'
import moment from 'moment/moment'

moment.locale('ru')

interface AdminUserCardProps {
	user: UserResponse
	groups: GroupResponse[]
	teachers: TeacherResponse[]
	currentUserId: number
	showDelete?: boolean
	onDeleted: () => void
	onUpdated: (user: UpdateUserRequest) => void
}

function AdminUserCard({
	user,
	groups,
	teachers,
	currentUserId,
	showDelete = true,
	onDeleted,
	onUpdated,
}: AdminUserCardProps) {
	const [editOpen, setEditOpen] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null)
	const isSelf = user.id === currentUserId

	const teacherFullName = (t: TeacherResponse) =>
		[t.surname, t.name, t.patronymic].filter(Boolean).join(' ')

	const resolvedTeacherId =
		teachers.find(t => teacherFullName(t) === user.curatorName)?.id ?? 0

	const resolvedGroupId =
		groups.find(s => s.name === user.groupDisplayName)?.id ?? 0

	const handleDelete = async () => {
		if (!deleteTarget) return
		const ok = await deleteUser(deleteTarget.id)
		if (ok) {
			showSuccess('Пользователь удалён')
			setDeleteTarget(null)
			onDeleted()
		} else {
			showError('Ошибка при удалении пользователя')
		}
	}

	return (
		<>
			<Table.Row>
				<Table.Cell>{user.id}</Table.Cell>
				<Table.Cell>
					{user.surname} {user.name} {user.patronymic}
				</Table.Cell>
				<Table.Cell>{user.login}</Table.Cell>
				<Table.Cell>{user.email}</Table.Cell>
				<Table.Cell>{user.phone}</Table.Cell>
				<Table.Cell>
					<UserRoleBadge
						role={
							user.role === 'Student'
								? 'Студент'
								: user.role === 'Teacher'
									? 'Преподаватель'
									: 'Админ'
						}
					/>
				</Table.Cell>
				<Table.Cell>{user.groupDisplayName || '—'}</Table.Cell>
				<Table.Cell>
					<div className='flex gap-2'>
						<Button
							size='sm'
							variant='surface'
							colorPalette='blue'
							disabled={isSelf}
							onClick={() => setEditOpen(true)}
						>
							<LuPencil />
						</Button>
						{showDelete && (
							<Button
								size='sm'
								variant='surface'
								colorPalette='red'
								disabled={isSelf}
								onClick={() => setDeleteTarget(user)}
							>
								<LuTrash2 />
							</Button>
						)}
					</div>
				</Table.Cell>
			</Table.Row>

			{showDelete && (
				<ConfirmModal
					isOpen={!!deleteTarget}
					onClose={() => setDeleteTarget(null)}
					onConfirm={handleDelete}
					title='Удаление пользователя'
					message='Вы уверены, что хотите удалить пользователя? Это действие нельзя отменить.'
					confirmText='Удалить'
					confirmColor='red'
				/>
			)}

			<EditUserModal
				key={user.id}
				isOpen={editOpen}
				user={user}
				userId={user.id}
				initialData={{
					surname: user.surname,
					name: user.name,
					patronymic: user.patronymic,
					login: user.login,
					email: user.email,
					phone: user.phone,
					groupId: resolvedGroupId,
					curatorId: resolvedTeacherId,
					dateEnrolled: user.dateEnrolled
						? moment(user.dateEnrolled).format('YYYY-MM-DD')
						: '',
					dateGraduated: user.dateGraduated
						? moment(user.dateGraduated).format('YYYY-MM-DD')
						: '',
				}}
				groups={groups}
				teachers={teachers}
				onClose={() => setEditOpen(false)}
				onUpdated={data => {
					setEditOpen(false)
					onUpdated(data)
				}}
			/>
		</>
	)
}

export default AdminUserCard
