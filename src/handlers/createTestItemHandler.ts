import { CreateItemRequestSchema, ExamItem } from '../types/item';
import { storage } from './index.js';
import * as z from 'zod';

export async function createItemHandler(data: any) : Promise<{ statusCode: number; body: ExamItem | { error: string } }> {  
  try {
    const validatedData = CreateItemRequestSchema.parse(data);

    const item = await storage.createItem(validatedData);

    return {
      statusCode: 201,
      body: item,
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
