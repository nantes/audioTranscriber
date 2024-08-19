import { RevAiApiClient, RevAiApiDeployment, RevAiApiDeploymentConfigMap } from 'revai-node-sdk';
import { REV_AI_TOKEN } from '../config/envConfig';

const clientRevAi = new RevAiApiClient({
  token: REV_AI_TOKEN,
  deploymentConfig: RevAiApiDeploymentConfigMap.get(RevAiApiDeployment.US),
});

export default clientRevAi;
