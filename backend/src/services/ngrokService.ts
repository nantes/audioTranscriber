import ngrok from '@ngrok/ngrok';

let ngrokUrl: string = '';

export const startNgrok = async () => {
  try {
    const listener = await ngrok.connect({ addr: 3000, authtoken_from_env: true });
    ngrokUrl = listener.url() || '';
    console.log(`Ingress established at: ${ngrokUrl}`);
    return ngrokUrl;
  } catch (err ) {
    console.error('Error starting ngrok:', err);
    throw err;
  }
};

export const getNgrokUrl = () => ngrokUrl;
