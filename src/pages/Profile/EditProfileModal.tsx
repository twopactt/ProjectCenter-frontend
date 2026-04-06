import {
	Button,
	Dialog,
	Field,
	FieldErrorText,
	Input,
	Text,
	Avatar,
	FileUpload,
	Float,
	useFileUploadContext,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { LuUpload, LuX, LuFile } from 'react-icons/lu'

interface EditProfileModalProps {
	isOpen: boolean
	onClose: () => void
	email: string
	phone: string
	photoUrl?: string | null
	name: string
	surname: string
	onSave: (
		email: string,
		phone: string,
		photoFile: File | null,
		removePhoto: boolean,
	) => void
	loading?: boolean
}

const FileList = () => {
	const ctx = useFileUploadContext()
	const files = ctx.acceptedFiles
	if (!files.length) return null

	return (
		<FileUpload.ItemGroup>
			{files.map(file => (
				<FileUpload.Item key={file.name} file={file} p='2' w='auto'>
					<LuFile size={28} />
					<Text fontSize='sm'>{file.name}</Text>
					<Float placement='top-end'>
						<FileUpload.ItemDeleteTrigger boxSize='4'>
							<LuX />
						</FileUpload.ItemDeleteTrigger>
					</Float>
				</FileUpload.Item>
			))}
		</FileUpload.ItemGroup>
	)
}

function EditProfileModal({
	isOpen,
	onClose,
	email: initialEmail,
	phone: initialPhone,
	photoUrl,
	name,
	surname,
	onSave,
	loading = false,
}: EditProfileModalProps) {
	const [email, setEmail] = useState(initialEmail)
	const [phone, setPhone] = useState(initialPhone)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const [emailError, setEmailError] = useState(false)
	const [emailErrorMessage, setEmailErrorMessage] = useState('')
	const [phoneError, setPhoneError] = useState(false)
	const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
	const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false)

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const phoneRegex = /^\+?[0-9]{10,15}$/

	useEffect(() => {
		if (isOpen) {
			setEmail(initialEmail)
			setPhone(initialPhone)
			setPhotoFile(null)
			setRemoveExistingPhoto(false)
			setEmailError(false)
			setEmailErrorMessage('')
			setPhoneError(false)
			setPhoneErrorMessage('')
		}
	}, [isOpen, initialEmail, initialPhone])

	const validateInputs = () => {
		let isValid = true

		if (!email || !emailRegex.test(email)) {
			setEmailError(true)
			setEmailErrorMessage('Введите корректный email')
			isValid = false
		} else {
			setEmailError(false)
			setEmailErrorMessage('')
		}

		if (!phone || !phoneRegex.test(phone)) {
			setPhoneError(true)
			setPhoneErrorMessage('Введите корректный номер телефона')
			isValid = false
		} else {
			setPhoneError(false)
			setPhoneErrorMessage('')
		}

		return isValid
	}

	const handleSave = () => {
		if (!validateInputs()) return
		onSave(email, phone, photoFile, removeExistingPhoto)
	}

	const handleClose = () => {
		setPhotoFile(null)
		setEmailError(false)
		setEmailErrorMessage('')
		setPhoneError(false)
		setPhoneErrorMessage('')
		onClose()
	}

	return (
		<Dialog.Root
			placement={'center'}
			open={isOpen}
			onOpenChange={e => {
				if (!e.open) handleClose()
			}}
		>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-5 flex flex-col gap-4 mx-4'>
					<Dialog.Header>
						<Dialog.Title>Редактирование профиля</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Text className='font-semibold'>Фото профиля</Text>
						<div className='flex items-center gap-4 flex-wrap'>
							<Avatar.Root size='lg'>
								<Avatar.Fallback name={`${name} ${surname}`} />
								{photoUrl && !photoFile && <Avatar.Image src={photoUrl} />}
								{photoFile && (
									<Avatar.Image src={URL.createObjectURL(photoFile)} />
								)}
							</Avatar.Root>
							<FileUpload.Root
								accept={['image/*']}
								onFileAccept={({ files }) => setPhotoFile(files[0] ?? null)}
								maxFiles={1}
							>
								<FileUpload.HiddenInput />
								<FileUpload.Trigger asChild>
									<Button variant='outline' size='sm'>
										<LuUpload />{' '}
										{photoFile ? 'Изменить фото' : 'Загрузить фото'}
									</Button>
								</FileUpload.Trigger>
								<FileList />
							</FileUpload.Root>
						</div>
						<Field.Root invalid={emailError}>
							<Text className='font-semibold'>Email</Text>
							<Input
								value={email}
								onChange={e => {
									setEmail(e.target.value)
									if (emailError) setEmailError(false)
								}}
								type='email'
								placeholder='example@mail.com'
							/>
							{emailError && (
								<FieldErrorText>{emailErrorMessage}</FieldErrorText>
							)}
						</Field.Root>
						<Field.Root invalid={phoneError}>
							<Text className='font-semibold'>Телефон</Text>
							<Input
								value={phone}
								onChange={e => {
									setPhone(e.target.value)
									if (phoneError) setPhoneError(false)
								}}
								type='tel'
								placeholder='+79000000000'
							/>
							{phoneError && (
								<FieldErrorText>{phoneErrorMessage}</FieldErrorText>
							)}
						</Field.Root>
					</Dialog.Body>
					<Dialog.Footer className='flex gap-3 justify-end'>
						<Button variant='ghost' onClick={handleClose}>
							Отмена
						</Button>
						<Button onClick={handleSave} loading={loading}>
							Сохранить
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default EditProfileModal
