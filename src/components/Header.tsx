import { Avatar, Button, Stack, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { getProfile, logout } from '@/services/auth'

function Header() {
	const profile = getProfile()

	return (
		<Stack
			bg='bg'
			className='!flex-row px-8 py-4 right-0 left-0 top-0 fixed z-50 border-b justify-between items-center'
		>
			<Stack className='!flex-row'>
				<Text className='font-bold text-2xl'>Центр проектной деятельности</Text>
			</Stack>
			<Stack className='!flex-row justify-self-end justify-end'>
				<Button type='button' className='button' onClick={logout}>
					Выйти
				</Button>
				<ColorModeButton className='flex' />
				<Avatar.Root>
					<Avatar.Fallback name={`${profile?.name} ${profile?.surname}`} />
					{profile?.photo && <Avatar.Image src={profile.photo} />}
				</Avatar.Root>
			</Stack>
		</Stack>
	)
}

export default Header
