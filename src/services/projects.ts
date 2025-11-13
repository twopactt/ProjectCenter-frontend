import axios from 'axios'
import config from './config'

export const getProjects = async () => {
	try {
		const token = ''

		const response = await axios.get(`${config.api.baseUrl}/projects`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data ?? []
	} catch (e) {
		console.error(e)
		return []
	}
}
