import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import { Button } from '@chakra-ui/react'
import { LuFolder, LuLayoutDashboard, LuUsers, LuGroup } from 'react-icons/lu'

interface Props {
	children: ReactNode
}

const navItems = [
	{ path: '/admin', label: 'Дашборд', icon: LuLayoutDashboard },
	{ path: '/admin/projects', label: 'Проекты', icon: LuFolder },
	{ path: '/admin/users', label: 'Пользователи', icon: LuUsers },
	{ path: '/admin/groups', label: 'Группы', icon: LuGroup },
]

function AdminLayout({ children }: Props) {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<Layout>
			<div className='flex min-h-[calc(100vh-5rem)]'>
				<aside className='w-56 shrink-0 border-r p-4 max-md:hidden'>
					<nav className='flex flex-col gap-1'>
						{navItems.map(item => {
							const isActive = location.pathname === item.path
							const Icon = item.icon
							return (
								<Button
									key={item.path}
									onClick={() => navigate(item.path)}
									variant={isActive ? 'subtle' : 'ghost'}
									colorPalette={isActive ? 'blue' : 'gray'}
									justifyContent='left'
									className='px-4 py-2.5 rounded-lg'
								>
									<Icon />
									{item.label}
								</Button>
							)
						})}
					</nav>
				</aside>

				<div className='flex-1 min-w-0 p-4 md:p-6 overflow-auto'>
					<nav className='flex gap-2 overflow-x-auto pb-3 mb-4 md:hidden'>
						{navItems.map(item => {
							const isActive = location.pathname === item.path
							const Icon = item.icon
							return (
								<Button
									key={item.path}
									onClick={() => navigate(item.path)}
									variant={isActive ? 'subtle' : 'ghost'}
									colorPalette={isActive ? 'blue' : 'gray'}
									className='px-4 py-2 rounded-full whitespace-nowrap'
								>
									<Icon />
									{item.label}
								</Button>
							)
						})}
					</nav>
					{children}
				</div>
			</div>
		</Layout>
	)
}

export default AdminLayout
