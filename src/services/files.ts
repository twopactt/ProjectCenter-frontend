export const fetchFile = async (url: string): Promise<Blob> => {
	const res = await fetch(url, { credentials: 'include' })
	return await res.blob()
}
