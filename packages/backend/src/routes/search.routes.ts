import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';
import { SearchService } from '../services/SearchService';
import { PineconeClient } from '../vector/PineconeClient';
import { OpenAIClient } from '../integrations/OpenAIClient';

const router = Router();

// Initialize services
const pinecone = new PineconeClient();
const openai = new OpenAIClient();
const searchService = new SearchService(pinecone, openai);

// Initialize controller
const controller = new SearchController(searchService);

// Routes
router.post('/', controller.search);
router.get('/suggestions', controller.suggestions);

export default router;
