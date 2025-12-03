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

export interface UserProfile {
	id: number
	name: string
	surname: string
	patronymic?: string
	login: string
	email: string
	phone: string
	role: string
	groupName?: string
	curatorName?: string
	photo?: string | null
}

interface Props {
	user: UserProfile
	email: string
	phone: string
	loading: boolean
	onEmailChange: (v: string) => void
	onPhoneChange: (v: string) => void
	onPhotoChange: (file: File | null) => void
	onSave: () => void
}

function ProfileCard({ user }: Props) {
	return (
		<Card.Root className='w-full max-w-sm'>
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
					<DataList.Item>
						<DataList.ItemLabel>Отчество</DataList.ItemLabel>
						<DataList.ItemValue>{user.patronymic}</DataList.ItemValue>
					</DataList.Item>
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
						<DataList.ItemValue>{user.role}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Группа</DataList.ItemLabel>
						<DataList.ItemValue>{user.groupName}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Куратор</DataList.ItemLabel>
						<DataList.ItemValue>{user.curatorName}</DataList.ItemValue>
					</DataList.Item>
				</DataList.Root>
			</CardBody>
			<CardFooter className='justify-end'>
				<Button colorPalette='red' variant='surface' onClick={logout}>
					Выйти
				</Button>
			</CardFooter>
		</Card.Root>
	)
}

export default ProfileCard
