import type { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
	children: ReactNode
}

function Layout({ children }: LayoutProps) {
	return (
		<div>
			<Header />
			<main className='pt-20'>{children}</main>
		</div>
	)
}

export default Layout
