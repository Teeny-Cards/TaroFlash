import { vi } from 'vitest'

/**
 * Creates a mock file for testing file uploads
 * @param {string} name - The file name
 * @param {string} type - The MIME type (e.g., 'image/jpeg', 'image/png')
 * @param {string} content - The file content (default: 'mock file content')
 * @returns {File} A mock File object
 */
export function createMockFile(
  name = 'test-image.jpg',
  type = 'image/jpeg',
  content = 'mock file content'
) {
  return new File([content], name, { type })
}

/**
 * Creates a mock FileReader with the specified result
 * @param {string} result - The result that FileReader should return (default: base64 data URL)
 * @returns {Object} A mock FileReader object
 */
export function createMockFileReader(result = 'data:image/jpeg;base64,mockbase64data') {
  return {
    readAsDataURL: vi.fn(),
    result,
    onload: null,
    onerror: null
  }
}

/**
 * Mocks the global FileReader constructor
 * @param {Object} mockFileReaderInstance - The mock FileReader object to return
 */
export function mockFileReader(mockFileReaderInstance) {
  global.FileReader = vi.fn(() => mockFileReaderInstance)
}

/**
 * Simulates a file upload on a file input element
 * @param {Object} fileInput - The Vue Test Utils wrapper for the file input
 * @param {File} file - The mock file to upload
 * @param {Object} mockFileReader - The mock FileReader object
 * @returns {Promise<void>}
 */
export async function simulateFileUpload(fileInput, file, mockFileReader) {
  // Set the files property on the input element
  Object.defineProperty(fileInput.element, 'files', {
    value: [file],
    writable: false
  })

  // Trigger the change event
  await fileInput.trigger('change')

  // Simulate FileReader onload callback
  if (mockFileReader.onload) {
    mockFileReader.onload({ target: mockFileReader })
  }
}

/**
 * Complete helper function that sets up file upload mocking and simulates the upload
 * @param {Object} wrapper - The Vue Test Utils wrapper
 * @param {string} selector - CSS selector for the file input
 * @param {Object} options - Options for the mock file and FileReader
 * @param {string} options.fileName - Name of the mock file
 * @param {string} options.fileType - MIME type of the mock file
 * @param {string} options.fileContent - Content of the mock file
 * @param {string} options.previewResult - The preview result from FileReader
 * @returns {Promise<{file: File, mockFileReader: Object}>}
 */
export async function mockAndSimulateFileUpload(wrapper, selector, options = {}) {
  const {
    fileName = 'test-image.jpg',
    fileType = 'image/jpeg',
    fileContent = 'mock image content',
    previewResult = 'data:image/jpeg;base64,mockbase64data'
  } = options

  // Create mock file and FileReader
  const mockFile = createMockFile(fileName, fileType, fileContent)
  const mockFileReaderInstance = createMockFileReader(previewResult)

  // Mock the FileReader constructor
  mockFileReader(mockFileReaderInstance)

  // Find the file input and simulate upload
  const fileInput = wrapper.find(selector)
  await simulateFileUpload(fileInput, mockFile, mockFileReaderInstance)

  // Wait for any async operations
  await wrapper.vm.$nextTick()

  return { file: mockFile, mockFileReader: mockFileReaderInstance }
}
