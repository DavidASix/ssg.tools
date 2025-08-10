import { describe, it, expect } from "vitest";

describe("Cancel Subscription API Schema", () => {
  it("should define the correct schema structure", async () => {
    const schema = await import("@/app/api/purchases/cancel-subscription/schema");
    
    expect(schema.default.url).toBe("/api/purchases/cancel-subscription");
    expect(schema.default.request).toBeDefined();
    expect(schema.default.response).toBeDefined();
    
    // Test response schema parsing
    const validResponse = {
      success: true,
      message: "Test message",
      cancelledSubscriptions: 1,
    };
    
    expect(() => schema.default.response.parse(validResponse)).not.toThrow();
    
    const parsedResponse = schema.default.response.parse(validResponse);
    expect(parsedResponse.success).toBe(true);
    expect(parsedResponse.message).toBe("Test message");
    expect(parsedResponse.cancelledSubscriptions).toBe(1);
  });

  it("should validate response schema with zero cancellations", async () => {
    const schema = await import("@/app/api/purchases/cancel-subscription/schema");
    
    const validResponse = {
      success: true,
      message: "No active subscriptions found",
      cancelledSubscriptions: 0,
    };
    
    expect(() => schema.default.response.parse(validResponse)).not.toThrow();
  });

  it("should validate response schema with error case", async () => {
    const schema = await import("@/app/api/purchases/cancel-subscription/schema");
    
    const errorResponse = {
      success: false,
      message: "Failed to cancel subscription",
      cancelledSubscriptions: 0,
    };
    
    expect(() => schema.default.response.parse(errorResponse)).not.toThrow();
  });
});