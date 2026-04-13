import { Badge } from "@chakra-ui/react"
import { getStatusColor } from "./statusProjectColors"

interface StatusProjectBadgeProps {
	status: string
}

export function StatusProjectBadge({ status }: StatusProjectBadgeProps) {
	return <Badge colorPalette={getStatusColor(status)}>{status}</Badge>
}
