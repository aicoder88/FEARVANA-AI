import fs from 'fs/promises';
import path from 'path';
import { StorageProvider } from './StorageProvider';

export class FileStorage implements StorageProvider {
  constructor(private basePath: string) {}

  async save(file: Buffer, filePath: string): Promise<string> {
    const fullPath = path.join(this.basePath, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file);

    return filePath;
  }

  async read(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return await fs.readFile(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.unlink(fullPath);
  }

  async exists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  getUrl(filePath: string): string {
    // For local storage, return file path
    // In production with S3, this would return a signed URL
    return `/files/${filePath}`;
  }

  /**
   * Generate a unique file path for storage
   */
  static generatePath(contentType: string, originalName: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ext = path.extname(originalName);
    const uuid = crypto.randomUUID();

    let typeDir = 'other';
    if (contentType.startsWith('video/')) typeDir = 'videos';
    else if (contentType.startsWith('audio/')) typeDir = 'audio';
    else typeDir = 'documents';

    return `uploads/${typeDir}/${year}/${month}/${uuid}${ext}`;
  }
}
