export const getStatusColor = (status: string): string => {
	switch (status) {
		case 'В разработке':
			return 'blue'
		case 'На проверке у преподавателя':
			return 'orange'
		case 'Проверен преподавателем':
			return 'cyan'
		case 'На защите':
			return 'purple'
		case 'Защищён':
			return 'green'
		case 'Отклонён':
			return 'red'
		case 'Архивирован':
			return 'gray'
		default:
			return 'gray'
	}
}
