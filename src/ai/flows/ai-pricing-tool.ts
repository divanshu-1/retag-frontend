// src/ai/flows/ai-pricing-tool.ts
'use server';

/**
 * @fileOverview An AI-powered pricing tool for used clothing items.
 *
 * - getAIPriceSuggestion - A function that takes clothing item photos and details, then suggests a fair price using AI.
 * - AIPricingToolInput - The input type for the getAIPriceSuggestion function.
 * - AIPricingToolOutput - The return type for the getAIPriceSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPricingToolInputSchema = z.object({
  photoDataUris: z
    .array(z.string())
    .describe(
      'An array of photos of the clothing item, as data URIs that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  gender: z.string().describe('The gender for which the clothing item is intended (e.g., male, female, unisex).'),
  brand: z.string().describe('The brand of the clothing item.'),
  article: z.string().describe('The type of clothing item (e.g., t-shirt, jeans, dress).'),
  size: z.string().describe('The size of the clothing item.'),
  ageLifecycle: z
    .string()
    .describe('The age or lifecycle stage of the item (e.g., new, used, vintage).'),
  wearCount: z.number().describe('The number of times the item has been worn.'),
  damageDescription: z
    .string()
    .optional()
    .describe('A description of any damage or imperfections on the clothing item.'),
});

export type AIPricingToolInput = z.infer<typeof AIPricingToolInputSchema>;

const AIPricingToolOutputSchema = z.object({
  suggestedPrice: z.number().describe('The AI-suggested price for the clothing item.'),
  conditionAssessment: z
    .string()
    .describe('An AI assessment of the condition of the clothing item based on the photos and description.'),
});

export type AIPricingToolOutput = z.infer<typeof AIPricingToolOutputSchema>;

export async function getAIPriceSuggestion(
  input: AIPricingToolInput
): Promise<AIPricingToolOutput> {
  return aiPricingToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPricingToolPrompt',
  input: {schema: AIPricingToolInputSchema},
  output: {schema: AIPricingToolOutputSchema},
  prompt: `You are an AI assistant specializing in pricing used clothing items. Analyze the provided information and photos to suggest a fair price and assess the item's condition.

  Clothing Details:
  - Gender: {{{gender}}}
  - Brand: {{{brand}}}
  - Article: {{{article}}}
  - Size: {{{size}}}
  - Age/Lifecycle: {{{ageLifecycle}}}
  - Wear Count: {{{wearCount}}}
  {{#if damageDescription}}
  - Damage Description: {{{damageDescription}}}
  {{/if}}

  Photos:
  {{#each photoDataUris}}
  {{media url=this}}
  {{/each}}

  Based on this information, provide a suggested price (in INR) and a condition assessment. Consider factors like brand reputation, current trends, and the item's overall condition.

  Output the price as a number and the condition assessment as a short string.
`,
});

const aiPricingToolFlow = ai.defineFlow(
  {
    name: 'aiPricingToolFlow',
    inputSchema: AIPricingToolInputSchema,
    outputSchema: AIPricingToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
