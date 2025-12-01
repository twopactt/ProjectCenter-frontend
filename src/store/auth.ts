import { create } from 'zustand'
import type { ProfileResponse } from '@/shared/types/auth'

interface AuthState {
	user: ProfileResponse | null
	setUser: (user: ProfileResponse) => void
	logout: () => void
	loadFromLocalStorage: () => void
}

export const useAuth = create<AuthState>(set => ({
	user: null,

	setUser: user => set({ user }),

	logout: () => {
		localStorage.removeItem('token')
		localStorage.removeItem('role')
		localStorage.removeItem('fullName')
		localStorage.removeItem('profile')
		set({ user: null })
	},

	loadFromLocalStorage: () => {
		try {
			const data = localStorage.getItem('profile')
			if (!data) return

			const user: ProfileResponse = JSON.parse(data)
			set({ user })
		} catch {
			console.error('Failed to parse stored profile')
		}
	},
}))
