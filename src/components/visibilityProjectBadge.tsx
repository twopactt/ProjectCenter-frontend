import { Badge } from '@chakra-ui/react'
import { FaLock, FaLockOpen } from 'react-icons/fa'

interface VisibilityProjectBadgeProps {
	isPublic: boolean
}

export function VisibilityProjectBadge({
	isPublic,
}: VisibilityProjectBadgeProps) {
	return (
		<Badge  colorPalette={isPublic ? 'green' : 'red'}>
			{isPublic ? <FaLockOpen /> : <FaLock />}
			{isPublic ? 'публичный' : 'приватный'}
		</Badge>
	)
}
