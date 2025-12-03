import config from './config'

export const getPhotoUrl = (path?: string | null) =>
	path ? `${config.api.staticUrl}${path}` : null
