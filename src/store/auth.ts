import { create } from 'zustand'
import type { ProfileResponse } from '@/shared/types/auth'
import api from '@/services/axios'
import { getPhotoUrl } from '@/services/utils'
import { getToken } from '@/services/auth'

interface AuthState {
	user: ProfileResponse | null
	setUser: (user: ProfileResponse) => void
	logout: () => void
	fetchProfile: () => Promise<void>
}

export const useAuth = create<AuthState>(set => ({
	user: null,

	setUser: user => set({ user }),

	logout: () => {
		localStorage.removeItem('token')
		set({ user: null })
	},

	fetchProfile: async () => {
		const token = getToken()
		if (!token) return

		try {
			const response = await api.get('/Profile')
			const normalized = {
				...response.data,
				photo: getPhotoUrl(response.data.photo),
			}
			set({ user: normalized })
		} catch {
			console.error('Failed to fetch profile')
		}
	},
}))
