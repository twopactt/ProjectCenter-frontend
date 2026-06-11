import AdminLayout from './AdminLayout'
import AdminDashboard from '../Dashboard/Admin/AdminDashboard'

function AdminPage() {
	return (
		<AdminLayout>
			<h3 className='font-bold text-2xl mb-6'>Панель управления</h3>
			<AdminDashboard />
		</AdminLayout>
	)
}

export default AdminPage
