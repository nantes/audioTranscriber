const mockUrl = 'http://mockurl.ngrok.io';

export const connect = jest.fn().mockResolvedValue({
  url: jest.fn().mockReturnValue(mockUrl),
});
