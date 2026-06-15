import { getUserRoleColor } from '@/shared/utils/userRoleColors'
import { Badge } from '@chakra-ui/react'

interface UserRoleBadgeProps {
	role: string
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
	return <Badge colorPalette={getUserRoleColor(role)}>{role}</Badge>
}
