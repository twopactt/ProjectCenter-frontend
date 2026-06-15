export const getFileSize = async (url: string): Promise<number> => {
	try {
		const response = await fetch(url, { method: 'HEAD' })
		const length = response.headers.get('Content-Length')
		return length ? parseInt(length, 10) : 0
	} catch (e) {
		console.error(e)
		return 0
	}
}
