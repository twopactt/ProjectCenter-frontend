import ProjectsPage from '@/pages/Projects/ProjectsPage'
import ProjectPage from '@/pages/Project/ProjectPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import type { JSX } from 'react'

export interface AppRoute {
	path: string
	element: JSX.Element
}

export interface RoutesGroup {
	roles: string[]
	items: AppRoute[]
}

export const routes: RoutesGroup[] = [
	{
		roles: ['Student', 'Teacher', 'Admin'],
		items: [
			{ path: '/projects', element: <ProjectsPage /> },
			{ path: '/profile', element: <ProfilePage /> },
			{ path: '/dashboard', element: <DashboardPage /> },
			{ path: '/projects/:id', element: <ProjectPage /> },
		],
	},
]
