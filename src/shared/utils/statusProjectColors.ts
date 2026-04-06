export const getStatusColor = (status: string): string => {
	switch (status) {
		case 'В разработке':
			return 'blue'
		case 'Завершен':
			return 'green'
		case 'Отменен':
			return 'red'
		case 'Утвержден':
			return 'teal'
		case 'В ожидании':
			return 'yellow'
		case 'На тестировании':
			return 'cyan'
		case 'На проверке':
			return 'purple'
		case 'Идея':
			return 'pink'
		case 'Требует доработки':
			return 'orange'
		default:
			return 'gray'
	}
}
