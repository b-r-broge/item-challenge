import * as z from 'zod';

/**
 * Exam Item Types
 */

const contentSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

const metadataSchema = z.object({
  author: z.string(),
  status: z.enum(['draft', 'review', 'approved', 'archived']),
  tags: z.array(z.string()),
});

export interface ExamItem {
  id: string;
  subject: string; // e.g., "AP Biology", "AP Calculus"
  itemType: string; // "multiple-choice", "free-response", "essay"
  difficulty: number; // 1-5
  content: {
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string;
    explanation: string;
  };
  metadata: {
    author: string;
    created: number; // timestamp
    lastModified: number; // timestamp
    version: number;
    status: string; // "draft", "review", "approved", "archived"
    tags: string[];
  };
  securityLevel: string; // "standard", "secure", "highly-secure"
}

export const ExamItemSchema = z.object({
  id: z.string(),
  subject: z.string(),
  itemType: z.string(),
  difficulty: z.number().min(1).max(5),
  content: contentSchema,
  metadata: metadataSchema,
  securityLevel: z.enum(['standard', 'secure', 'highly-secure']),
})

export interface CreateItemRequest {
  subject: string;
  itemType: string;
  difficulty: number;
  content: {
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  };
  metadata: {
    author: string;
    status: string;
    tags: string[];
  };
  securityLevel: string;
}

export const CreateItemRequestSchema = z.object({
  subject: z.string(),
  itemType: z.string(),
  difficulty: z.number().min(1).max(5),
  content: contentSchema,
  metadata: metadataSchema,
  securityLevel: z.enum(['standard', 'secure', 'highly-secure']),
});

export interface UpdateItemRequest {
  subject?: string;
  itemType?: string;
  difficulty?: number;
  content?: Partial<ExamItem["content"]>;
  metadata?: Partial<ExamItem["metadata"]>;
  securityLevel?: string;
}

export const UpdateItemRequestSchema = z.object({
  subject: z.string().optional(),
  itemType: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  content: contentSchema.partial().optional(),
  metadata: metadataSchema.partial().optional(),
  securityLevel: z.enum(['standard', 'secure', 'highly-secure']).optional(),
});

export interface ListItemsQuery {
  limit?: number;
  offset?: number;
  subject?: string;
  status?: string;
}

