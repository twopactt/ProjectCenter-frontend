import axios from 'axios'
import config from './config'
import { getToken, logout } from './auth'

const api = axios.create({
	baseURL: config.api.baseUrl,
})

api.interceptors.request.use(request => {
	const token = getToken()

	if (token) {
		request.headers.Authorization = `Bearer ${token}`
	}

	return request
})

api.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response?.status === 401) {
			logout()
		}

		return Promise.reject(error)
	},
)

export default api
