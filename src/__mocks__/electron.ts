const mockElectronAPI = {
  getCaptureSources: jest.fn().mockResolvedValue([{ id: 'test-source', name: 'Test Source' }]),
  captureScreen: jest.fn().mockResolvedValue({
    ok: true,
    filepath: '/fake/path/capture.png'
  }),
  readImageBase64: jest.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
  saveChipReport: jest.fn().mockResolvedValue({ success: true }),
};

window.electronAPI = mockElectronAPI;