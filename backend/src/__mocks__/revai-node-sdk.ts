export const RevAiApiDeployment = {
    US: 'US',
  };
  
  export const RevAiApiDeploymentConfigMap = new Map([
    [RevAiApiDeployment.US, {}],
  ]);
  
  export class RevAiApiClient {
    constructor(config: any) {
    }
  
    submitJobAudioData() {
      return Promise.resolve({ id: 'mock-job-id' });
    }
  
    getTranscriptText() {
      return Promise.resolve('Mock transcript text');
    }
  }
  