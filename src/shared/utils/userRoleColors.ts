export const getUserRoleColor = (role: string): string => {
	switch (role) {
		case 'Студент':
			return 'green'
		case 'Преподаватель':
			return 'blue'
		case 'Админ':
			return 'red'
		default:
			return 'gray'
	}
}
