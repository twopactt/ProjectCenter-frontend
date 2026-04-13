import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getToken } from '@/services/auth'
import api from '@/services/axios'
import { useAuth } from '@/store/auth'
import { useEffect, useState } from 'react'
import ProfileCard from './ProfileCard'
import { getPhotoUrl } from '@/services/utils'
import EditProfileModal from './EditProfileModal'
import { showSuccess, showError } from '@/shared/utils/toast'

function ProfilePage() {
	const { user, setUser } = useAuth()
	const [editOpen, setEditOpen] = useState(false)
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
				localStorage.setItem('profile', JSON.stringify(normalized))
			} catch (e) {
				console.error('Ошибка загрузки профиля', e)
			}
		}

		if (!user) loadProfile()
	}, [user, setUser])

	const handleSave = async (
		email: string,
		phone: string,
		photoFile: File | null,
	) => {
		if (!user) return
		setLoading(true)

		const formData = new FormData()
		formData.append('Email', email)
		formData.append('PhoneNumber', phone)
		if (photoFile) formData.append('Photo', photoFile)

		try {
			const token = getToken()
			const response = await api.put('/Profile', formData, {
				headers: { Authorization: `Bearer ${token}` },
			})

			const normalized = {
				...user,
				email,
				phone,
				photo: response.data?.photo
					? getPhotoUrl(response.data.photo)
					: photoFile
						? URL.createObjectURL(photoFile)
						: user.photo,
			}

			setUser(normalized)
			localStorage.setItem('profile', JSON.stringify(normalized))
			showSuccess('Профиль обновлён')
			setEditOpen(false)
		} catch {
			showError('Ошибка при обновлении профиля')
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
			<section className='flex items-center justify-center justify-self-center min-h-[85vh] px-4 md:px-8'>
				<ProfileCard user={user} onEditClick={() => setEditOpen(true)} />
				<EditProfileModal
					isOpen={editOpen}
					onClose={() => setEditOpen(false)}
					email={user.email}
					phone={user.phone}
					photoUrl={user.photo}
					name={user.name}
					surname={user.surname}
					onSave={handleSave}
					loading={loading}
				/>
			</section>
		</Layout>
	)
}

export default ProfilePage
