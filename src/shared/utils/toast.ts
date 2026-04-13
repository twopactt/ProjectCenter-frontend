import { toaster } from '@/components/ui/toaster'

export const showSuccess = (description: string, title = 'Успешно') => {
	toaster.create({
		title,
		description,
		type: 'success',
		closable: true,
	})
}

export const showError = (description: string, title = 'Ошибка') => {
	toaster.create({
		title,
		description,
		type: 'error',
		closable: true,
	})
}

export const showInfo = (description: string, title = 'Информация') => {
	toaster.create({
		title,
		description,
		type: 'info',
		closable: true,
	})
}
