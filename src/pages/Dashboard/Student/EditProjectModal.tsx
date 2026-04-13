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
import { useState, useEffect } from 'react'
import { LuFile, LuUpload, LuX } from 'react-icons/lu'

interface Props {
	isOpen: boolean
	onClose: () => void
	projectId: number
	isPublic: boolean
	existingProjectFile?: File | null
	existingDocFile?: File | null
	onUpdated: (data: {
		isPublic: boolean
		projectFile?: File[]
		docFile?: File[]
		removeProjectFile: boolean
		removeDocFile: boolean
	}) => void
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
	existingProjectFile,
	existingDocFile,
	onUpdated,
}: Props) {
	const [publicVal, setPublicVal] = useState(isPublic)
	const [projectFiles, setProjectFiles] = useState<File[]>([])
	const [docFiles, setDocFiles] = useState<File[]>([])
	const [removeProjectFile, setRemoveProjectFile] = useState(false)
	const [removeDocFile, setRemoveDocFile] = useState(false)

	useEffect(() => {
		if (isOpen) {
			setPublicVal(isPublic)
			setProjectFiles(existingProjectFile ? [existingProjectFile] : [])
			setDocFiles(existingDocFile ? [existingDocFile] : [])
			setRemoveProjectFile(false)
			setRemoveDocFile(false)
		}
	}, [isOpen, isPublic, existingProjectFile, existingDocFile])

	const handleSave = async () => {
		const form = new FormData()
		form.append('IsPublic', publicVal.toString())

		if (removeProjectFile) {
			form.append('RemoveProjectFile', 'true')
		}
		if (removeDocFile) {
			form.append('RemoveDocumentationFile', 'true')
		}
		if (projectFiles.length > 0 && projectFiles[0] !== existingProjectFile) {
			form.append('NewProjectFile', projectFiles[0])
		}
		if (docFiles.length > 0 && docFiles[0] !== existingDocFile) {
			form.append('NewDocumentationFile', docFiles[0])
		}

		const updated = await updateMyProjectFiles(projectId, form)

		if (updated) {
			onUpdated({
				isPublic: publicVal,
				projectFile: projectFiles,
				docFile: docFiles,
				removeProjectFile,
				removeDocFile,
			})
		}
	}

	const hasProjectFile = projectFiles.length > 0
	const hasDocFile = docFiles.length > 0

	return (
		<Dialog.Root placement='center' open={isOpen}>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-5 flex flex-col gap-4 mx-4'>
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
							onFileAccept={({ files }) => {
								setProjectFiles(files)
								setRemoveProjectFile(false)
							}}
							onFileChange={({ acceptedFiles }) => {
								if (
									acceptedFiles.length === 0 &&
									hasProjectFile &&
									!removeProjectFile
								) {
									setRemoveProjectFile(true)
									setProjectFiles([])
								}
							}}
							acceptedFiles={projectFiles}
						>
							<FileUpload.HiddenInput />
							{!hasProjectFile || removeProjectFile ? (
								<FileUpload.Trigger asChild>
									<Button variant='outline'>
										<LuUpload /> Загрузить проект
									</Button>
								</FileUpload.Trigger>
							) : null}
							<FileList />
						</FileUpload.Root>
						<Text className='font-semibold mt-3'>
							Документация (.pdf/.doc/.docx/.txt)
						</Text>
						<FileUpload.Root
							accept={['.pdf', '.doc', '.docx', '.txt']}
							onFileAccept={({ files }) => {
								setDocFiles(files)
								setRemoveDocFile(false)
							}}
							onFileChange={({ acceptedFiles }) => {
								if (
									acceptedFiles.length === 0 &&
									hasDocFile &&
									!removeDocFile
								) {
									setRemoveDocFile(true)
									setDocFiles([])
								}
							}}
							acceptedFiles={docFiles}
						>
							<FileUpload.HiddenInput />
							{!hasDocFile || removeDocFile ? (
								<FileUpload.Trigger asChild>
									<Button variant='outline'>
										<LuUpload /> Загрузить документацию
									</Button>
								</FileUpload.Trigger>
							) : null}
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
