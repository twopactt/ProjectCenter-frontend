import api from './axios'

export const createGrade = async (
	projectId: number,
	value: number,
	comment: string,
): Promise<boolean> => {
	try {
		await api.post('/grades', { projectId, value, comment })
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}

export const updateGrade = async (
	projectId: number,
	value: number,
	comment: string,
): Promise<boolean> => {
	try {
		await api.put(`/grades/${projectId}`, { projectId, value, comment })
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}
