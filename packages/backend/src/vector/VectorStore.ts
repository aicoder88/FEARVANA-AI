export interface VectorMetadata {
  contentItemId: string;
  chunkIndex: number;
  text: string;
}

export interface VectorQueryResult {
  id: string;
  score: number;
  metadata: VectorMetadata;
}

export interface VectorStore {
  upsert(vectors: Array<{ id: string; values: number[]; metadata: VectorMetadata }>): Promise<void>;
  query(vector: number[], topK: number, filter?: Record<string, any>): Promise<VectorQueryResult[]>;
  delete(ids: string[]): Promise<void>;
}
