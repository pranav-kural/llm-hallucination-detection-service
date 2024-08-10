/*

This file contains the code related to the system prompt that will be used for LLM hallucination detection from the given input text. The input text contains the response generated by LLM, the prompt that was used to generate the response, and any additional instructions that were provided to the LLM.

Expected Input:

{
  "response": "The response generated by LLM",
  "prompt": "The prompt that was used to generate the response",
  "instructions": "Any additional instructions that were provided to LLM"
}

Output should contain the following: 

1. Factual Inconsistency Detection - check that the response generated by LLM is factually correct.
2. Instruction Adherence Check - check that the response generated by LLM adheres to the instructions provided.
3. Context Relevance Check - check that the response generated by LLM is relevant to the context of the prompt.

Output schema:

{
  "factualConsistency": true,
  "factualConsistencyReasoning": "The reasoning behind the result of the factual inconsistency check",
  "instructionAdherence": true,
  "instructionAdherenceReasoning": "The reasoning behind the result of the instruction adherence check",
  "contextRelevance": true
  "contextRelevanceReasoning": "The reasoning behind the result of the context relevance check"
  "error": "Optional error message if an error occurred during processing"
}

*/

import z from 'zod';
import {defineDotprompt} from '@genkit-ai/dotprompt';

/**
 * Output schema for the LLM hallucination detection service.
 *
 * The output schema contains the results of the hallucination detection checks.
 *
 * @property {boolean} factualConsistency - The result of the factual consistency check.
 * @property {string} factualConsistencyReasoning - The reasoning behind the result of the factual consistency check.
 * @property {boolean} instructionAdherence - The result of the instruction adherence check.
 * @property {string} instructionAdherenceReasoning - The reasoning behind the result of the instruction adherence check.
 * @property {boolean} contextRelevance - The result of the context relevance check.
 * @property {string} contextRelevanceReasoning - The reasoning behind the result of the context relevance check.
 * @property {string} error - Optional error message if an error occurred during processing.
 */
export const serviceOutputSchema = z.object({
  factualConsistency: z.boolean(),
  factualConsistencyReasoning: z.string(),
  instructionAdherence: z.boolean(),
  instructionAdherenceReasoning: z.string(),
  contextRelevance: z.boolean(),
  contextRelevanceReasoning: z.string(),
  error: z.string().optional(), // Optional error message
});

/**
 * Type definition for the service output.
 *
 * The service output contains the results of the hallucination detection checks.
 *
 * @typedef {object} ServiceOutput
 *
 * @property {boolean} factualConsistency - The result of the factual consistency check.
 * @property {string} factualConsistencyReasoning - The reasoning behind the result of the factual consistency check.
 * @property {boolean} instructionAdherence - The result of the instruction adherence check.
 * @property {string} instructionAdherenceReasoning - The reasoning behind the result of the instruction adherence check.
 * @property {boolean} contextRelevance - The result of the context relevance check.
 * @property {string} contextRelevanceReasoning - The reasoning behind the result of the context relevance check.
 * @property {string} error - Optional error message if an error occurred during processing.
 */
export type ServiceOutput = z.infer<typeof serviceOutputSchema>;

export const serviceSystemPrompt = defineDotprompt(
  {
    name: 'llm-hallucination-detection-prompt',
    input: {
      schema: z.object({
        query: z.string().min(1),
      }),
    },
    output: {
      format: 'json',
      schema: serviceOutputSchema,
    },
  },
  `{{role "system"}}
You are an expert in detecting hallucinations in responses generated by large language models (LLMs). Your task is to evaluate a given response based on four key criteria to ensure its accuracy and reliability.

Specifically, you should focus on:

- Factual Consistency Detection: Verify that the response is factually and logically accurate. Flag any statements that are incorrect. Return 'true' if the response is consistent with the facts provided or if no factual inconsistencies are detected.

- Instruction Adherence Check: Confirm that the response follows the instructions provided in the prompt. Highlight any deviations or failures to comply with the given instructions.

- Context Relevance Check: Assess whether the response is relevant to the context of the prompt. Flag any portions of the response that are off-topic or irrelevant.

Provide clear explanations and reasoning for each issue you identify, ensuring that your analysis is precise and comprehensive.

You are given the following input for evaluation. This input contains the prompt used to generate the response and the response itself, along with any additional instructions provided to the LLM:
{{query}}
`
);