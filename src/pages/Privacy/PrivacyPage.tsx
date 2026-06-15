import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getDataStorageSummary } from '@/services/privacy'
import type { DataStorageItem } from '@/shared/types/privacy'
import { Card, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

function PrivacyPage() {
	const [items, setItems] = useState<DataStorageItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			const data = await getDataStorageSummary()
			setItems(data)
			setLoading(false)
		}
		load()
	}, [])

	if (loading) {
		return (
			<Layout>
				<Header />
				<section className='px-4 md:px-8 py-6 flex flex-col gap-6'>
					<h3 className='font-bold text-2xl'>Конфиденциальность</h3>
					<Text className='text-center text-gray-500 py-8'>Загрузка...</Text>
				</section>
			</Layout>
		)
	}

	return (
		<Layout>
			<Header />
			<section className='px-4 md:px-8 py-6 flex flex-col gap-6'>
				<h3 className='font-bold text-2xl'>Конфиденциальность и политики</h3>
				<Text>
					Эта сводка показывает цели и категории по умолчанию для сохранения
					пользовательских данных. Определенные области могут иметь более
					конкретные категории и цели, чем перечисленные здесь.
				</Text>

				<div className='flex flex-col gap-4'>
					{items.map(item => (
						<Card.Root
							key={item.name}
							className='transition-all'
							_hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
						>
							<Card.Header>
								<Card.Title>{item.name}</Card.Title>
							</Card.Header>
							<Card.Body className='flex flex-col gap-2'>
								<Text fontWeight='semibold'>Цель</Text>
								{item.purpose && <Text>{item.purpose}</Text>}
								<Text fontWeight='semibold'>Срок хранения</Text>
								{item.retentionPeriod && <Text>{item.retentionPeriod}</Text>}
							</Card.Body>
							{!item.retentionPeriod && (
								<Card.Footer>
									<Text color='gray.500'>Срок хранения не был определен</Text>
								</Card.Footer>
							)}
						</Card.Root>
					))}
				</div>
			</section>
		</Layout>
	)
}

export default PrivacyPage
