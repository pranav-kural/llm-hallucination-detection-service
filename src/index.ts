import {ChatEndpointConfig, configureAndRunServer} from '@oconva/qvikchat';
import {serviceOutputSchema, serviceSystemPrompt} from './prompts';

/**
 * Endpoint configuration for the hallucination detection service.
 *
 * Listens for queries on the 'detect' endpoint.
 */
const endpointConfig: ChatEndpointConfig = {
  endpoint: 'detect',
  systemPrompt: serviceSystemPrompt,
  outputSchema: {
    format: 'json',
    schema: serviceOutputSchema,
  },
  modelConfig: {
    name: 'gemini15Flash',
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
  verbose: false,
};

/**
 * Configure and run the hallucination detection service.
 */
configureAndRunServer({
  endpointConfigs: [endpointConfig],
});
