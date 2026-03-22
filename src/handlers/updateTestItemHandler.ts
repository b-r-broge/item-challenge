import { ExamItem, UpdateItemRequestSchema } from '../types/item';
import { storage } from './index.js';
import * as z from 'zod';

export async function updateItemHandler(id: string, data: any) : Promise<{ statusCode: number; body: ExamItem | { error: string } }> {
  try {
    const item = await storage.getItem(id);

    if (!item) {
      return {
        statusCode: 404,
        body: { error: 'Item not found' },
      };
    }

    const validatedData = UpdateItemRequestSchema.parse(data);

    const updatedItem = await storage.updateItem(id, validatedData);

    return {
      statusCode: 201,
      body: updatedItem ?? { error: 'Failed to update item' },
    };
  } catch (error) {
        console.error('Error creating item:', error);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 422,
        body: { error: JSON.stringify(error.issues) },
      };
    }
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
