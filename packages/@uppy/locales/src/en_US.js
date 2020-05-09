const en_US = {}

en_US.strings = {
  addBulkFilesFailed: {
    '0': 'Failed to add %{smart_count} file due to an internal error',
    '1': 'Failed to add %{smart_count} files due to internal errors'
  },
  addMore: 'Add more',
  addMoreFiles: 'Add more files',
  addingMoreFiles: 'Adding more files',
  allowAccessDescription: 'In order to take pictures or record video with your camera, please allow camera access for this site.',
  allowAccessTitle: 'Please allow access to your camera',
  authenticateWith: 'Connect to %{pluginName}',
  authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
  back: 'Back',
  browse: 'browse',
  cancel: 'Cancel',
  cancelUpload: 'Cancel upload',
  chooseFiles: 'Choose files',
  closeModal: 'Close Modal',
  companionError: 'Connection with Companion failed',
  companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
  complete: 'Complete',
  connectedToInternet: 'Connected to the Internet',
  copyLink: 'Copy link',
  copyLinkToClipboardFallback: 'Copy the URL below',
  copyLinkToClipboardSuccess: 'Link copied to clipboard',
  creatingAssembly: 'Preparing upload...',
  creatingAssemblyFailed: 'Transloadit: Could not create Assembly',
  dashboardTitle: 'File Uploader',
  dashboardWindowTitle: 'File Uploader Window (Press escape to close)',
  dataUploadedOfTotal: '%{complete} of %{total}',
  done: 'Done',
  dropHereOr: 'Drop files here or %{browse}',
  dropHint: 'Drop your files here',
  dropPaste: 'Drop files here, paste or %{browse}',
  dropPasteImport: 'Drop files here, paste, %{browse} or import from:',
  editFile: 'Edit file',
  editing: 'Editing %{file}',
  emptyFolderAdded: 'No files were added from empty folder',
  encoding: 'Encoding...',
  enterCorrectUrl: 'Incorrect URL: Please make sure you are entering a direct link to a file',
  enterUrlToImport: 'Enter URL to import a file',
  exceedsSize: 'This file exceeds maximum allowed size of',
  exceedsSize2: '%{backwardsCompat} %{size}',
  failedToFetch: 'Companion failed to fetch this URL, please make sure it’s correct',
  failedToUpload: 'Failed to upload %{file}',
  fileSource: 'File source: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} of %{smart_count} file uploaded',
    '1': '%{complete} of %{smart_count} files uploaded'
  },
  filter: 'Filter',
  finishEditingFile: 'Finish editing file',
  folderAdded: {
    '0': 'Added %{smart_count} file from %{folder}',
    '1': 'Added %{smart_count} files from %{folder}'
  },
  generatingThumbnails: 'Generating thumbnails...',
  import: 'Import',
  importFrom: 'Import from %{name}',
  loading: 'Loading...',
  logOut: 'Log out',
  micDisabled: 'Microphone access denied by user',
  myDevice: 'My Device',
  noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
  noFilesFound: 'You have no files or folders here',
  noInternetConnection: 'No Internet connection',
  noNewAlreadyUploading: 'Cannot add new files: already uploading',
  openFolderNamed: 'Open folder %{name}',
  pause: 'Pause',
  pauseUpload: 'Pause upload',
  paused: 'Paused',
  poweredBy: 'Powered by',
  poweredBy2: '%{backwardsCompat} %{uppy}',
  processingXFiles: {
    '0': 'Processing %{smart_count} file',
    '1': 'Processing %{smart_count} files'
  },
  recording: 'Recording',
  recordingLength: 'Recording length %{recording_length}',
  recordingStoppedMaxSize: 'Recording stopped because the file size is about to exceed the limit',
  removeFile: 'Remove file',
  resetFilter: 'Reset filter',
  resume: 'Resume',
  resumeUpload: 'Resume upload',
  retry: 'Retry',
  retryUpload: 'Retry upload',
  saveChanges: 'Save changes',
  selectAllFilesFromFolderNamed: 'Select all files from folder %{name}',
  selectFileNamed: 'Select file %{name}',
  selectX: {
    '0': 'Select %{smart_count}',
    '1': 'Select %{smart_count}'
  },
  smile: 'Smile!',
  startCapturing: 'Begin screen capturing',
  startRecording: 'Begin video recording',
  stopCapturing: 'Stop screen capturing',
  stopRecording: 'Stop video recording',
  streamActive: 'Stream active',
  streamPassive: 'Stream passive',
  submitRecordedFile: 'Submit captured video',
  takePicture: 'Take a picture',
  timedOut: 'Upload stalled for %{seconds} seconds, aborting.',
  unselectAllFilesFromFolderNamed: 'Unselect all files from folder %{name}',
  unselectFileNamed: 'Unselect file %{name}',
  upload: 'Upload',
  uploadComplete: 'Upload complete',
  uploadFailed: 'Upload failed',
  uploadPaused: 'Upload paused',
  uploadXFiles: {
    '0': 'Upload %{smart_count} file',
    '1': 'Upload %{smart_count} files'
  },
  uploadXNewFiles: {
    '0': 'Upload +%{smart_count} file',
    '1': 'Upload +%{smart_count} files'
  },
  uploading: 'Uploading',
  uploadingXFiles: {
    '0': 'Uploading %{smart_count} file',
    '1': 'Uploading %{smart_count} files'
  },
  xFilesSelected: {
    '0': '%{smart_count} file selected',
    '1': '%{smart_count} files selected'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} more file added',
    '1': '%{smart_count} more files added'
  },
  xTimeLeft: '%{time} left',
  youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
  youCanOnlyUploadX: {
    '0': 'You can only upload %{smart_count} file',
    '1': 'You can only upload %{smart_count} files'
  },
  youHaveToAtLeastSelectX: {
    '0': 'You have to select at least %{smart_count} file',
    '1': 'You have to select at least %{smart_count} files'
  }
}

en_US.pluralize = function (count) {
  if (count === 1) {
    return 0
  }
  return 1
}

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.en_US = en_US
}

module.exports = en_US