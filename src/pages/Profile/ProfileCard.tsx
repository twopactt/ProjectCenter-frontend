import { logout } from '@/services/auth'
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	DataList,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import type { ProfileResponse } from '@/shared/types/auth'

interface Props {
	user: ProfileResponse
	onEditClick: () => void
}

function ProfileCard({ user, onEditClick }: Props) {
	return (
		<Card.Root className='w-full max-w-sm mt-4 md:mt-0'>
			<CardHeader className='flex items-center justify-center justify-self-center'>
				<Avatar.Root size='2xl'>
					<Avatar.Fallback name={`${user.name} ${user.surname}`} />
					{user.photo && <Avatar.Image src={user.photo} />}
				</Avatar.Root>
			</CardHeader>
			<CardBody>
				<DataList.Root orientation='horizontal' gap={4} className='flex-wrap'>
					<DataList.Item>
						<DataList.ItemLabel>Фамилия</DataList.ItemLabel>
						<DataList.ItemValue>{user.surname}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Имя</DataList.ItemLabel>
						<DataList.ItemValue>{user.name}</DataList.ItemValue>
					</DataList.Item>
					{user.patronymic && (
						<DataList.Item>
							<DataList.ItemLabel>Отчество</DataList.ItemLabel>
							<DataList.ItemValue>{user.patronymic}</DataList.ItemValue>
						</DataList.Item>
					)}
					<DataList.Item>
						<DataList.ItemLabel>Логин</DataList.ItemLabel>
						<DataList.ItemValue>{user.login}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Почта</DataList.ItemLabel>
						<DataList.ItemValue>{user.email}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Телефон</DataList.ItemLabel>
						<DataList.ItemValue>{user.phone}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Роль</DataList.ItemLabel>
						<DataList.ItemValue>
							{user.role === 'Student'
								? 'Студент'
								: user.role === 'Teacher'
									? 'Преподаватель'
									: user.role === 'Admin'
										? 'Админ'
										: user.role}
						</DataList.ItemValue>
					</DataList.Item>
					{user.role === 'Student' && (
						<>
							<DataList.Item>
								<DataList.ItemLabel>Группа</DataList.ItemLabel>
								<DataList.ItemValue>{user.groupDisplayName}</DataList.ItemValue>
							</DataList.Item>
							<DataList.Item>
								<DataList.ItemLabel>Куратор</DataList.ItemLabel>
								<DataList.ItemValue>{user.curatorName}</DataList.ItemValue>
							</DataList.Item>
						</>
					)}
				</DataList.Root>
			</CardBody>
			<CardFooter className='flex justify-between'>
				<Button colorPalette='red' variant='surface' onClick={logout}>
					Выйти
				</Button>
				<Button variant='surface' colorPalette='blue' onClick={onEditClick}>
					<LuPencil />
				</Button>
			</CardFooter>
		</Card.Root>
	)
}

export default ProfileCard
