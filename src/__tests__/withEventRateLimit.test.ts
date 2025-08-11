import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { withEventRateLimit } from "@/middleware/withEventRateLimit";
import type { RequestHandler } from "@/middleware/types";

// Mock the events module
vi.mock("@/lib/server/events", () => ({
  countEventsInTimeWindow: vi.fn(),
  recordEvent: vi.fn(),
}));

const { countEventsInTimeWindow, recordEvent } = await import("@/lib/server/events");
const mockedCountEventsInTimeWindow = vi.mocked(countEventsInTimeWindow);
const mockedRecordEvent = vi.mocked(recordEvent);

describe("withEventRateLimit middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext = {
    user_id: "test-user-123",
    params: Promise.resolve({}),
  };

  const mockRequest = new NextRequest("http://localhost:3000/api/test");

  const mockHandler: RequestHandler<typeof mockContext> = vi.fn(
    async () => NextResponse.json({ success: true }),
  );

  it("should allow request when under rate limit", async () => {
    // Mock that user has made 5 calls (under the limit of 10)
    mockedCountEventsInTimeWindow.mockResolvedValue(5);
    mockedRecordEvent.mockResolvedValue(undefined);

    const rateLimitedHandler = withEventRateLimit(
      {
        event: "fetch_reviews",
        maxCalls: 10,
        timeWindowHours: 24,
      },
      mockHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(mockedCountEventsInTimeWindow).toHaveBeenCalledWith(
      "fetch_reviews",
      "test-user-123",
      24,
    );
    expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockContext);
    expect(mockedRecordEvent).toHaveBeenCalledWith(
      "fetch_reviews",
      "test-user-123",
      {},
    );
  });

  it("should reject request when rate limit is exceeded", async () => {
    // Mock that user has made 10 calls (at the limit)
    mockedCountEventsInTimeWindow.mockResolvedValue(10);

    const rateLimitedHandler = withEventRateLimit(
      {
        event: "fetch_reviews",
        maxCalls: 10,
        timeWindowHours: 24,
      },
      mockHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(429);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Rate limit exceeded",
      details: {
        event: "fetch_reviews",
        maxCalls: 10,
        timeWindowHours: 24,
        currentCount: 10,
      },
    });

    expect(mockedCountEventsInTimeWindow).toHaveBeenCalledWith(
      "fetch_reviews",
      "test-user-123",
      24,
    );
    expect(mockHandler).not.toHaveBeenCalled();
    expect(mockedRecordEvent).not.toHaveBeenCalled();
  });

  it("should not record event when handler returns error status", async () => {
    // Mock that user has made 2 calls (under the limit)
    mockedCountEventsInTimeWindow.mockResolvedValue(2);
    
    // Create a handler that returns an error
    const errorHandler: RequestHandler<typeof mockContext> = vi.fn(
      async () => NextResponse.json({ error: "Bad request" }, { status: 400 }),
    );

    const rateLimitedHandler = withEventRateLimit(
      {
        event: "fetch_reviews",
        maxCalls: 10,
        timeWindowHours: 24,
      },
      errorHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(400);
    expect(mockedCountEventsInTimeWindow).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
    expect(mockedRecordEvent).not.toHaveBeenCalled();
  });

  it("should record event with custom metadata", async () => {
    mockedCountEventsInTimeWindow.mockResolvedValue(1);
    mockedRecordEvent.mockResolvedValue(undefined);

    const customMetadata = { business_id: 123 };
    const rateLimitedHandler = withEventRateLimit(
      {
        event: "update_reviews",
        maxCalls: 5,
        timeWindowHours: 12,
        metadata: customMetadata,
      },
      mockHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(mockedRecordEvent).toHaveBeenCalledWith(
      "update_reviews",
      "test-user-123",
      customMetadata,
    );
  });

  it("should handle database errors gracefully", async () => {
    // Mock database error
    mockedCountEventsInTimeWindow.mockRejectedValue(new Error("Database error"));

    const rateLimitedHandler = withEventRateLimit(
      {
        event: "fetch_reviews",
        maxCalls: 10,
        timeWindowHours: 24,
      },
      mockHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Internal Server Error",
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should work with different time windows and limits", async () => {
    mockedCountEventsInTimeWindow.mockResolvedValue(50);
    mockedRecordEvent.mockResolvedValue(undefined);

    const rateLimitedHandler = withEventRateLimit(
      {
        event: "fetch_reviews",
        maxCalls: 100,
        timeWindowHours: 1, // 1 hour window
      },
      mockHandler,
    );

    const response = await rateLimitedHandler(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(mockedCountEventsInTimeWindow).toHaveBeenCalledWith(
      "fetch_reviews",
      "test-user-123",
      1,
    );
  });
});