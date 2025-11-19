import { create } from 'zustand'

interface User {
	id: number
	surname: string
	name: string
	patronymic: string
	login: string
	email: string
	phone: string
	role: string
	photo: string | null
}

interface AuthState {
	user: User | null
	setUser: (user: User) => void
	logout: () => void
}

export const useAuth = create<AuthState>(set => ({
	user: null,
	setUser: user => set({ user }),
	logout: () => set({ user: null }),
}))
