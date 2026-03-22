import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createItemHandler, updateItemHandler } from "../handlers";
import { ExamItem } from "../types/item";

describe("updateItemHandler", () => {
  let itemId: string;

  beforeEach(async () => {
    const itemData = {
      subject: "AP Biology",
      itemType: "multiple-choice",
      difficulty: 3,
      content: {
        question: "What is photosynthesis?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Photosynthesis is the process...",
      },
      metadata: {
        author: "test-author",
        status: "draft",
        tags: ["biology", "photosynthesis"],
      },
      securityLevel: "standard",
    };

    const result = await createItemHandler(itemData);
    if (typeof result.body === "object" && result.body !== null && 'id' in result.body) {
      // cannot be an error object
      itemId = result.body.id;
    }
  });

  afterEach( () => {
    itemId = "";
  });

  it("should update an item successfully", async () => {
    const updatedData = {
      metadata: {
        status: "approved",
      }
    };

    const result = await updateItemHandler(itemId, updatedData);

    expect(result.statusCode).toBe(201); // 201 is correct because we are creating a new version, not updating the existing item
    if ("body" in result && typeof result.body === "object" && result.body !== null && 'id' in result.body) {
      const updatedItem = result.body as ExamItem;
      expect(updatedItem.id).toBe(itemId);
      expect(updatedItem.metadata.status).toBe("approved");
      expect(updatedItem.metadata.version).toBe(2); // version will increment
    }
  });
});