import type { DataStorageItem } from '@/shared/types/privacy'
import api from './axios'

export const getDataStorageSummary = async (): Promise<DataStorageItem[]> => {
	const response = await api.get('/Privacy/data-storage-summary')
	return response.data
}
