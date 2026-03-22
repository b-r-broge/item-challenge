import { createStorage } from '../storage/index.js';
import { createItemHandler } from './createTestItemHandler.js';
import { updateItemHandler } from './updateTestItemHandler.js';
import { getItemHandler } from './getTestItemHandler.js';

export const storage = createStorage();

export { 
    createItemHandler,
    updateItemHandler,
    getItemHandler
};