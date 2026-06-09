import {
	Avatar,
	Box,
	Link,
	Menu,
	Portal,
	Stack,
	Text,
	IconButton,
	Drawer,
	VStack,
	CloseButton,
	Float,
	Circle,
} from '@chakra-ui/react'
import { ColorModeButton } from './ui/color-mode'
import { logout } from '@/services/auth'
import { useAuth } from '@/store/auth'
import { getUnreadCount } from '@/services/notifications'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LuBell, LuMenu } from 'react-icons/lu'

function Header() {
	const profile = useAuth(s => s.user)
	const navigate = useNavigate()
	const location = useLocation()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [unreadCount, setUnreadCount] = useState(0)

	useEffect(() => {
		const fetchUnreadCount = async () => {
			const count = await getUnreadCount()
			setUnreadCount(count)
		}

		fetchUnreadCount()
	}, [])

	const links = [
		{
			title: 'Профиль',
			action: () => {
				navigate('/profile')
				setIsMobileMenuOpen(false)
			},
		},
		{
			title: 'Выйти',
			action: () => {
				logout()
				setIsMobileMenuOpen(false)
			},
			color: 'error',
		},
	]

	const navLinks = [
		{ title: 'Дашборд', path: '/dashboard' },
		{ title: 'Проекты', path: '/projects' },
	]

	if (profile?.role === 'Admin') {
		navLinks.push({ title: 'Админ панель', path: '/admin' })
	}

	const handleNavClick = (path: string) => {
		navigate(path)
		setIsMobileMenuOpen(false)
	}

	return (
		<>
			<Stack
				bg='bg'
				className='!flex-row px-4 md:px-8 py-4 right-0 left-0 top-0 fixed z-50 border-b justify-between'
				overflow='hidden'
			>
				<Stack className='!flex-row items-center' minW={0} flex={1}>
					<Text
						className='font-bold text-sm md:text-lg lg:text-2xl'
						wordBreak='break-word'
					>
						Центр проектной деятельности
					</Text>

					<Box className='hidden md:flex ml-12 gap-3 justify-between'>
						{navLinks.map(link => {
							const isActive = location.pathname === link.path
							return (
								<Link
									key={link.title}
									onClick={() => navigate(link.path)}
									color={isActive ? 'black' : 'gray.focusRing'}
									_dark={{ color: isActive ? 'white' : 'gray.400' }}
									_hover={{ color: 'black', _dark: { color: 'white' } }}
									className='cursor-pointer font-bold text-base lg:text-lg'
								>
									{link.title}
								</Link>
							)
						})}
					</Box>
				</Stack>

				<Stack
					className='!flex-row justify-self-end justify-end items-center gap-2 md:gap-4'
					flexShrink={0}
				>
					<ColorModeButton className='flex' />

					<Box position='relative'>
						<IconButton
							variant='ghost'
							aria-label='Уведомления'
							onClick={() => navigate('/notifications')}
						>
							<LuBell />
						</IconButton>
						{unreadCount > 0 && (
							<Float offset='1'>
								<Circle size='5' bg='red' color='white'>
									{unreadCount > 9 ? '9+' : unreadCount}
								</Circle>
							</Float>
						)}
					</Box>

					<IconButton
						variant='ghost'
						onClick={() => setIsMobileMenuOpen(true)}
						className='md:hidden'
						aria-label='Открыть меню'
					>
						<LuMenu size='24px' />
					</IconButton>

					<Menu.Root positioning={{ placement: 'bottom-end' }}>
						<Menu.Trigger
							rounded='full'
							focusRing='outside'
							cursor='pointer'
							className='hidden md:block'
						>
							<Avatar.Root>
								<Avatar.Fallback
									name={`${profile?.name} ${profile?.surname}`}
								/>
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

			<Drawer.Root
				open={isMobileMenuOpen}
				onOpenChange={e => setIsMobileMenuOpen(e.open)}
				placement='start'
			>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content>
							<Drawer.Header className='!flex justify-between items-center border-b pb-4'>
								<Drawer.Title className='text-xl font-bold'>Меню</Drawer.Title>
								<CloseButton onClick={() => setIsMobileMenuOpen(false)} />
							</Drawer.Header>
							<Drawer.Body>
								<VStack align='stretch' gap={4} mt={4}>
									<Stack
										direction='row'
										align='center'
										gap={3}
										pb={4}
										borderBottom='1px solid'
										borderColor='gray.200'
										_dark={{ borderColor: 'gray.700' }}
									>
										<Avatar.Root>
											<Avatar.Fallback
												name={`${profile?.name} ${profile?.surname}`}
											/>
											{profile?.photo && <Avatar.Image src={profile.photo} />}
										</Avatar.Root>
										<Box>
											<Text fontWeight='bold'>
												{profile?.name} {profile?.surname}
											</Text>
											<Text fontSize='sm' color='gray.500'>
												{profile?.role === 'Student'
													? 'Студент'
													: profile?.role === 'Teacher'
														? 'Преподаватель'
														: 'Админ'}
											</Text>
										</Box>
									</Stack>

									{navLinks.map(link => {
										const isActive = location.pathname === link.path
										return (
											<Link
												key={link.title}
												onClick={() => handleNavClick(link.path)}
												color={isActive ? 'black' : 'gray.600'}
												_dark={{ color: isActive ? 'white' : 'gray.400' }}
												_hover={{ color: 'black', _dark: { color: 'white' } }}
												className='cursor-pointer font-medium text-lg py-2'
											>
												{link.title}
											</Link>
										)
									})}

									<Link
										onClick={() => handleNavClick('/profile')}
										className='cursor-pointer font-medium text-lg py-2'
										color='gray.600'
										_dark={{ color: 'gray.400' }}
									>
										Профиль
									</Link>
									<Link
										onClick={() => logout()}
										className='cursor-pointer font-medium text-lg py-2'
										color='red.500'
									>
										Выйти
									</Link>
								</VStack>
							</Drawer.Body>
						</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		</>
	)
}

export default Header
