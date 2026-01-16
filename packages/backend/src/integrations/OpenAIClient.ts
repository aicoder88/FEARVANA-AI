import OpenAI from 'openai';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import fs from 'fs';

export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Transcribe audio/video file using Whisper
   */
  async transcribe(filePath: string): Promise<string> {
    try {
      logger.info(`Transcribing file: ${filePath}`);

      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: config.openai.transcriptionModel,
        response_format: 'text',
      });

      return transcription;
    } catch (error) {
      logger.error('Transcription failed', { error, filePath });
      throw error;
    }
  }

  /**
   * Generate embeddings for text
   */
  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: config.openai.embeddingModel,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Embedding generation failed', { error });
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async createEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.client.embeddings.create({
        model: config.openai.embeddingModel,
        input: texts,
      });

      return response.data.map((d) => d.embedding);
    } catch (error) {
      logger.error('Batch embedding generation failed', { error });
      throw error;
    }
  }

  /**
   * Extract entities from text using GPT-4
   */
  async extractEntities(text: string): Promise<any[]> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting entities from text. Extract people, places, concepts, organizations, and topics from the given text. Return a JSON array of entities with format: [{"type": "PERSON|PLACE|CONCEPT|ORGANIZATION|TOPIC", "name": "entity name", "confidence": 0-1, "description": "brief description"}]`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content || '{}';
      const parsed = JSON.parse(content);
      return parsed.entities || [];
    } catch (error) {
      logger.error('Entity extraction failed', { error });
      throw error;
    }
  }

  /**
   * Generate tag suggestions from text
   */
  async suggestTags(text: string, existingTags: string[] = []): Promise<string[]> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert at categorizing content. Analyze the text and suggest 5-10 relevant tags. Return a JSON object with format: {"tags": ["tag1", "tag2", ...]}. Prefer existing tags when appropriate: ${existingTags.join(', ')}`,
          },
          {
            role: 'user',
            content: text.substring(0, 4000), // Limit length
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content || '{}';
      const parsed = JSON.parse(content);
      return parsed.tags || [];
    } catch (error) {
      logger.error('Tag suggestion failed', { error });
      throw error;
    }
  }
}
