import api from './axios'

export const createComment = async (
	projectId: number,
	text: string,
): Promise<boolean> => {
	try {
		await api.post(`/projects/${projectId}/comments`, { text })
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}
