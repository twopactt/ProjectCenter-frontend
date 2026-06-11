import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'

interface Props {
	children: ReactNode
}

const navItems = [
	{ path: '/admin', label: 'Дашборд' },
	{ path: '/admin/projects', label: 'Проекты' },
	{ path: '/admin/users', label: 'Пользователи' },
	{ path: '/admin/groups', label: 'Группы' },
]

function AdminLayout({ children }: Props) {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<Layout>
			<div className='flex min-h-[calc(100vh-5rem)]'>
				<aside className='w-56 shrink-0 border-r p-4 hidden md:block'>
					<nav className='flex flex-col gap-1'>
						{navItems.map(item => {
							const isActive = location.pathname === item.path
							return (
								<button
									key={item.path}
									onClick={() => navigate(item.path)}
									className={`text-left px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
										isActive
											? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300'
											: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
									}`}
								>
									{item.label}
								</button>
							)
						})}
					</nav>
				</aside>

				<div className='flex-1 p-4 md:p-6 overflow-auto'>{children}</div>
			</div>
		</Layout>
	)
}

export default AdminLayout
