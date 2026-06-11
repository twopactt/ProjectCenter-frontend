import { useEffect, useState } from 'react'
import { Button, Table, Text } from '@chakra-ui/react'
import AdminLayout from '../AdminLayout'
import { CreateGroupModal } from './CreateGroupModal'
import { getGroups } from '@/services/directory'
import type { GroupResponse } from '@/shared/types/group'

function AdminGroupsPage() {
	const [groups, setGroups] = useState<GroupResponse[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)

	const fetchData = async () => {
		setLoading(true)
		const data = await getGroups()
		setGroups(data)
		setLoading(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<AdminLayout>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='font-bold text-2xl'>Группы</h3>
				<Button onClick={() => setModalOpen(true)}>Создать группу</Button>
			</div>

			<CreateGroupModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onCreated={fetchData}
			/>

			{loading ? (
				<Text className='text-center py-16 text-gray-500'>Загрузка...</Text>
			) : groups.length === 0 ? (
				<Text className='text-center py-16 text-gray-500'>
					Группы не найдены
				</Text>
			) : (
				<Table.ScrollArea className='max-w-md max-h-190' borderWidth='1px'>
					<Table.Root className='w-full' showColumnBorder stickyHeader interactive>
						<Table.Header>
							<Table.Row bg='bg.subtle'>
								<Table.ColumnHeader>ID</Table.ColumnHeader>
								<Table.ColumnHeader>Название</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{groups.map(g => (
								<Table.Row key={g.id}>
									<Table.Cell>{g.id}</Table.Cell>
									<Table.Cell>{g.name}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
			)}
		</AdminLayout>
	)
}

export default AdminGroupsPage
