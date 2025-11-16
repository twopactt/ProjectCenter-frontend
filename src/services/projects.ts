import api from './axios'

export const getProjects = async () => {
	try {
		const response = await api.get(`/projects`)

		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}
