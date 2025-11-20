import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { Button, Card, Field, Input, Stack } from '@chakra-ui/react'

function AdminPage() {
	return (
		<Layout>
			<Header />
			<div className='px-8 py-4 flex flex-row justify-start items-start gap-12'>
				<div className='flex flex-col gap-3'>
					<Card.Root className='max-w-md w-full self-center'>
						<Card.Header>
							<Card.Title className='font-bold text-xl'>Панель админа</Card.Title>
						</Card.Header>
						<Card.Body>
							<Stack className='!gap-4 w-full'>
								<Field.Root>
									<Field.Label>поле 1</Field.Label>
									<Input placeholder='поле1' />
								</Field.Root>
							</Stack>
						</Card.Body>
						<Card.Footer className='justify-center flex flex-col gap-3'>
							<Button type='submit' className='button w-full'>
								Сделать
							</Button>
						</Card.Footer>
					</Card.Root>
				</div>
			</div>
		</Layout>
	)
}

export default AdminPage
