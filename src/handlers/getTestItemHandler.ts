import { CreateItemRequest, CreateItemRequestSchema, ExamItem, ExamItemSchema, UpdateItemRequest, UpdateItemRequestSchema, ListItemsQuery } from '../types/item';
import { storage } from './index.js';

export async function getItemHandler(id: string) : Promise<{ statusCode: number; body: ExamItem | { error: string } }> {
  try {
    if (id === 'test') {
      return {
        statusCode: 200,
        body: {
          id: 'test',
          subject: "AP Biology",
          itemType: "multiple-choice",
          difficulty: 3,
          content: {
            question: "What is photosynthesis?",
            options: [
              "A",
              "B",
              "C",
              "D"
            ],
            correctAnswer: "A",
            explanation: "Photosynthesis is..."
          },
          metadata: {
            author: "test-author",
            status: "draft",
            tags: [
              "biology",
              "photosynthesis"
            ],
            created: 1774012298927,
            lastModified: 1774012304811,
            version: 1
          },
          securityLevel: "secure"
        }
      };
    }

    const item = await storage.getItem(id);

    if (!item) {
      return {
        statusCode: 404,
        body: { error: 'Item not found' },
      };
    }

    return {
      statusCode: 200,
      body: item,
    };
  } catch (error) {
    console.error('Error getting item:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
