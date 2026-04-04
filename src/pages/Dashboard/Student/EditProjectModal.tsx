import { updateMyProjectFiles } from '@/services/projects'
import {
	Button,
	Dialog,
	FileUpload,
	Float,
	Switch,
	Text,
	useFileUploadContext,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuFile, LuUpload, LuX } from 'react-icons/lu'

interface Props {
	isOpen: boolean
	onClose: () => void
	projectId: number
	isPublic: boolean
	onUpdated: () => void
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

function EditProjectModal({
	isOpen,
	onClose,
	projectId,
	isPublic,
	onUpdated,
}: Props) {
	const [publicVal, setPublicVal] = useState(isPublic)
	const [projectFile, setProjectFile] = useState<File | null>(null)
	const [docFile, setDocFile] = useState<File | null>(null)

	const handleSave = async () => {
		const form = new FormData()
		form.append('IsPublic', publicVal.toString())
		form.append('RemoveProjectFile', (!projectFile).toString())
		form.append('RemoveDocumentationFile', (!docFile).toString())

		if (projectFile) form.append('NewProjectFile', projectFile)
		if (docFile) form.append('NewDocumentationFile', docFile)

		const updated = await updateMyProjectFiles(projectId, form)
		if (updated) {
			onUpdated()
			onClose()
		}
	}

	return (
		<Dialog.Root placement={'center'} open={isOpen}>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-5 flex flex-col gap-4'>
					<Dialog.Header>
						<Dialog.Title>Редактирование проекта</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body className='flex flex-col gap-4'>
						<Text className='font-semibold'>Видимость</Text>
						<Switch.Root
							checked={publicVal}
							onCheckedChange={e => setPublicVal(e.checked)}
							className='flex items-center gap-3'
						>
							<Switch.HiddenInput />
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label>Публичный доступ</Switch.Label>
						</Switch.Root>
						<Text className='font-semibold mt-3'>
							Файл проекта (.zip/.rar/.7z)
						</Text>
						<FileUpload.Root
							accept={['.zip', '.rar', '.7z']}
							onFileAccept={({ files }) => setProjectFile(files[0] ?? null)}
						>
							<FileUpload.HiddenInput />
							<FileUpload.Trigger asChild>
								<Button variant='outline'>
									<LuUpload /> Загрузить проект
								</Button>
							</FileUpload.Trigger>
							<FileList />
						</FileUpload.Root>
						<Text className='font-semibold mt-3'>
							Документация (.pdf/.doc/.docx/.txt)
						</Text>
						<FileUpload.Root
							accept={['.pdf', '.doc', '.docx', '.txt']}
							onFileAccept={({ files }) => setDocFile(files[0] ?? null)}
						>
							<FileUpload.HiddenInput />
							<FileUpload.Trigger asChild>
								<Button variant='outline'>
									<LuUpload /> Загрузить документацию
								</Button>
							</FileUpload.Trigger>
							<FileList />
						</FileUpload.Root>
					</Dialog.Body>
					<Dialog.Footer className='flex gap-3 justify-end'>
						<Button variant='ghost' onClick={onClose}>
							Отмена
						</Button>
						<Button onClick={handleSave}>Сохранить</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default EditProjectModal
