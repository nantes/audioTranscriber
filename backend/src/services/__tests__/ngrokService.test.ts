import { startNgrok, getNgrokUrl } from '../ngrokService';
import ngrok from '@ngrok/ngrok';

jest.mock('@ngrok/ngrok');

describe('Ngrok Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start ngrok and return the URL', async () => {
    const mockUrl = 'http://mockurl.ngrok.io';
    (ngrok.connect as jest.Mock).mockResolvedValueOnce({ url: () => mockUrl });

    const url = await startNgrok();

    expect(ngrok.connect).toHaveBeenCalledWith({ addr: 3000, authtoken_from_env: true });
    expect(url).toBe(mockUrl);
    expect(getNgrokUrl()).toBe(mockUrl);
  });

  it('should handle errors when starting ngrok', async () => {
    const error = new Error('Ngrok connection failed');
    (ngrok.connect as jest.Mock).mockRejectedValueOnce(error);

    await expect(startNgrok()).rejects.toThrow('Ngrok connection failed');
  });
});
