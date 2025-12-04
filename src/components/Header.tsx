import { Avatar, Box, Link, Menu, Portal, Stack, Text } from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { getProfile, logout } from '@/services/auth'
import { useLocation, useNavigate } from 'react-router-dom'

function Header() {
	const profile = getProfile()
	const navigate = useNavigate()
	const location = useLocation()

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

	const navLinks = [
		{ title: 'Дашборд', path: '/dashboard' },
		{ title: 'Проекты', path: '/projects' },
	]

	return (
		<Stack
			bg='bg'
			className='!flex-row px-8 py-4 right-0 left-0 top-0 fixed z-50 border-b justify-between'
		>
			<Stack className='!flex-row items-center'>
				<Text className='font-bold text-2xl'>Центр проектной деятельности</Text>
				<Box className='ml-12 gap-3 justify-between flex'>
					{navLinks.map(link => {
						const isActive = location.pathname === link.path
						return (
							<Link
								key={link.title}
								onClick={() => navigate(link.path)}
								color={isActive ? 'black' : 'gray.focusRing'}
								_dark={{ color: isActive ? 'white' : 'gray.400' }}
								_hover={{ color: 'black', _dark: { color: 'white' } }}
								className='cursor-pointer font-bold text-lg'
							>
								{link.title}
							</Link>
						)
					})}
				</Box>
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
