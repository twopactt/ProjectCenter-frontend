import { Avatar, Menu, Portal, Stack, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { getProfile, logout } from '@/services/auth'
import { useNavigate } from 'react-router-dom'

function Header() {
	const profile = getProfile()
	const navigate = useNavigate()

	const links = [
		{
			title: 'Профиль',
			action: () => navigate('/profile'),
		},
		{
			title: 'Выйти',
			action: logout,
			color: 'error',
		},
	]

	return (
		<Stack
			bg='bg'
			className='!flex-row px-8 py-4 right-0 left-0 top-0 fixed z-50 border-b justify-between'
		>
			<Stack className='!flex-row items-center'>
				<Text className='font-bold text-2xl'>Центр проектной деятельности</Text>
			</Stack>
			<Stack className='!flex-row justify-self-end justify-end items-center'>
				<ColorModeButton className='flex' />
				<Menu.Root positioning={{ placement: 'bottom-end' }}>
					<Menu.Trigger rounded='full' focusRing='outside' cursor='pointer'>
						<Avatar.Root>
							<Avatar.Fallback name={`${profile?.name} ${profile?.surname}`} />
							{profile?.photo && <Avatar.Image src={profile.photo} />}
						</Avatar.Root>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								{links.map(link => (
									<Menu.Item
										key={link.title}
										value={link.title}
										onClick={link.action}
										cursor='pointer'
										color={link.color === 'error' ? 'fg.error' : undefined}
										_hover={
											link.color === 'error'
												? { bg: 'bg.error', color: 'fg.error' }
												: {}
										}
									>
										{link.title}
									</Menu.Item>
								))}
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu.Root>
			</Stack>
		</Stack>
	)
}

export default Header
