import { updateMyProjectFiles } from '@/services/projects'
import {
	Button,
	Dialog,
	FileUpload,
	Float,
	Progress,
	Switch,
	Text,
	useFileUploadContext,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { LuFile, LuUpload, LuX } from 'react-icons/lu'
import { showError } from '@/shared/utils/toast'

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
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState('')

	useEffect(() => {
		if (isOpen) {
			setPublicVal(isPublic)
			setProjectFiles(existingProjectFile ? [existingProjectFile] : [])
			setDocFiles(existingDocFile ? [existingDocFile] : [])
			setRemoveProjectFile(false)
			setRemoveDocFile(false)
			setError('')
		}
	}, [isOpen, isPublic, existingProjectFile, existingDocFile])

	const handleSave = async () => {
		const newProjectFile =
			projectFiles.length > 0 && projectFiles[0] !== existingProjectFile
				? projectFiles[0]
				: null
		const newDocFile =
			docFiles.length > 0 && docFiles[0] !== existingDocFile
				? docFiles[0]
				: null

		if (newProjectFile && newProjectFile.size > 50 * 1024 * 1024) {
			showError('Файл проекта не должен превышать 50 MB')
			return
		}
		if (newDocFile && newDocFile.size > 10 * 1024 * 1024) {
			showError('Файл документации не должен превышать 10 MB')
			return
		}

		setLoading(true)
		setProgress(0)

		const form = new FormData()
		form.append('IsPublic', publicVal.toString())

		if (removeProjectFile) {
			form.append('RemoveProjectFile', 'true')
		}
		if (removeDocFile) {
			form.append('RemoveDocumentationFile', 'true')
		}
		if (newProjectFile) {
			form.append('NewProjectFile', newProjectFile)
		}
		if (newDocFile) {
			form.append('NewDocumentationFile', newDocFile)
		}

		const result = await updateMyProjectFiles(projectId, form, setProgress)

		setLoading(false)

		if ('data' in result) {
			onUpdated({
				isPublic: publicVal,
				projectFile: projectFiles,
				docFile: docFiles,
				removeProjectFile,
				removeDocFile,
			})
		} else {
			setError(result.error)
		}
	}

	const hasProjectFile = projectFiles.length > 0
	const hasDocFile = docFiles.length > 0

	return (
		<Dialog.Root placement='center' open={isOpen}>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content className='p-0 md:p-5 gap-0 md:gap-4 mx-4'>
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
								if (files[0]?.size > 50 * 1024 * 1024) {
									showError('Файл проекта не должен превышать 50 MB')
									return
								}
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
								if (files[0]?.size > 10 * 1024 * 1024) {
									showError('Файл документации не должен превышать 10 MB')
									return
								}
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
					{loading && (
						<div className='px-6 pb-2'>
							<Progress.Root value={progress} maxW='full' size='sm'>
								<Progress.Track>
									<Progress.Range />
								</Progress.Track>
							</Progress.Root>
							<Text textStyle='sm' mt={1} textAlign='center'>
								Загрузка... {progress}%
							</Text>
						</div>
					)}
					{error && (
						<Text color='red' className='px-6 pb-2' textStyle='sm'>
							{error}
						</Text>
					)}
					<Dialog.Footer className='flex gap-3 justify-end'>
						<Button variant='ghost' onClick={onClose}>
							Отмена
						</Button>
						<Button loading={loading} onClick={handleSave}>
							Сохранить
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	)
}

export default EditProjectModal
