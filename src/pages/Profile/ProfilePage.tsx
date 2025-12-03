import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getToken } from '@/services/auth'
import api from '@/services/axios'
import { useAuth } from '@/store/auth'
import { useEffect, useState } from 'react'
import ProfileCard from './ProfileCard'
import { getPhotoUrl } from '@/services/utils'

function ProfilePage() {
	const { user, setUser } = useAuth()
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const token = getToken()
				if (!token) return

				const response = await api.get('/Profile', {
					headers: { Authorization: `Bearer ${token}` },
				})

				const normalized = {
					...response.data,
					photo: getPhotoUrl(response.data.photo),
				}

				setUser(normalized)
				setEmail(normalized.email)
				setPhone(normalized.phone)
				localStorage.setItem('profile', JSON.stringify(normalized))
			} catch (e) {
				console.error('Ошибка загрузки профиля', e)
			}
		}

		if (!user) loadProfile()
	}, [user, setUser])

	const handleSave = async () => {
		if (!user) return
		setLoading(true)

		const formData = new FormData()
		formData.append('Email', email)
		formData.append('PhoneNumber', phone)
		if (photoFile) formData.append('Photo', photoFile)

		try {
			const token = getToken()
			const response = await api.put(`/Profile`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			})

			const normalized = {
				...response.data,
				photo: getPhotoUrl(response.data.photo),
			}

			setUser(normalized)
			localStorage.setItem('profile', JSON.stringify(normalized))
			alert('Профиль обновлён')
		} catch {
			alert('Ошибка при обновлении профиля')
		} finally {
			setLoading(false)
		}
	}

	if (!user)
		return (
			<Layout>
				<Header />
				<div className='flex justify-center items-center h-[70vh] text-xl opacity-60'>
					Загрузка профиля...
				</div>
			</Layout>
		)

	return (
		<Layout>
			<Header />
			<section className='flex items-center justify-center justify-self-center min-h-[85vh] px-8'>
				<ProfileCard
					user={user}
					email={email}
					phone={phone}
					loading={loading}
					onEmailChange={setEmail}
					onPhoneChange={setPhone}
					onPhotoChange={setPhotoFile}
					onSave={handleSave}
				/>
			</section>
		</Layout>
	)
}

export default ProfilePage
