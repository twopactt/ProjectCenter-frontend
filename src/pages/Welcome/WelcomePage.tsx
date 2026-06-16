import {
	Button,
	Heading,
	Text,
	Stack,
	Container,
	Icon,
	Box,
	Grid,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ColorModeButton } from '@/components/ui/color-mode'
import {
	LuGraduationCap,
	LuUsers,
	LuFolderGit2,
	LuAward,
	LuArrowRight,
} from 'react-icons/lu'

const features = [
	{
		icon: LuFolderGit2,
		title: 'Управление проектами',
		description: 'Создавай и отслеживай свои проекты в удобном формате',
	},
	{
		icon: LuUsers,
		title: 'Наставничество',
		description: 'Преподаватели помогают на каждом этапе работы',
	},
	{
		icon: LuAward,
		title: 'Оценивание',
		description: 'Прозрачная система оценок и рецензирования',
	},
	{
		icon: LuGraduationCap,
		title: 'Развитие',
		description: 'Защита проектов и пополнение портфолио',
	},
]

function WelcomePage() {
	const navigate = useNavigate()

	return (
		<Box minH='100vh' bg={{ base: 'gray.50', _dark: 'gray.900' }}>
			<ColorModeButton className='fixed top-4 right-4 z-10' />

			<Container maxW='6xl' pt={{ base: 8, md: 16 }} pb={16}>
				<Stack
					textAlign='center'
					align='center'
					gap={6}
					mb={{ base: 12, md: 20 }}
				>
					<Box
						bg={{ base: 'teal.100', _dark: 'teal.900' }}
						p={4}
						borderRadius='full'
						display='inline-flex'
					>
						<Icon
							as={LuGraduationCap}
							boxSize={10}
							color='teal.600'
							_dark={{ color: 'teal.200' }}
						/>
					</Box>

					<Heading
						as='h1'
						size='4xl'
						fontWeight='extrabold'
						letterSpacing='tight'
						maxW='2xl'
					>
						Центр проектной{' '}
						<Text as='span' color='teal.500'>
							деятельности
						</Text>
					</Heading>

					<Text
						fontSize='lg'
						maxW='xl'
						color={{ base: 'gray.600', _dark: 'gray.400' }}
					>
						Единая платформа для управления учебными проектами колледжа.
						Создавай, отслеживай и защищай свои проекты цифрового формата.
					</Text>

					<Button
						size='lg'
						px={8}
						py={6}
						onClick={() => navigate('/login')}
						className='button'
					>
						Войти в систему
						<Icon as={LuArrowRight} ml={2} boxSize={5} />
					</Button>
				</Stack>

				<Grid
					templateColumns={{
						base: '1fr',
						md: 'repeat(2, 1fr)',
						lg: 'repeat(4, 1fr)',
					}}
					gap={6}
				>
					{features.map((feature, i) => (
						<Box
							key={i}
							bg={{ base: 'white', _dark: 'gray.800' }}
							p={6}
							borderRadius='xl'
							boxShadow='sm'
							borderWidth={1}
							borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
							transition='all 0.2s'
							_hover={{
								transform: 'translateY(-2px)',
								boxShadow: 'md',
								borderColor: 'teal.400',
							}}
						>
							<Icon as={feature.icon} boxSize={8} color='teal.500' mb={4} />
							<Heading as='h3' size='md' mb={2}>
								{feature.title}
							</Heading>
							<Text
								fontSize='sm'
								color={{ base: 'gray.600', _dark: 'gray.400' }}
							>
								{feature.description}
							</Text>
						</Box>
					))}
				</Grid>

				<Stack
					textAlign='center'
					align='center'
					mt={16}
					pt={8}
					borderTopWidth={1}
					borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
				>
					<Text fontSize='sm' color={{ base: 'gray.500', _dark: 'gray.500' }}>
						&copy; {new Date().getFullYear()} Центр проектной деятельности
						колледжа
					</Text>
				</Stack>
			</Container>
		</Box>
	)
}

export default WelcomePage
