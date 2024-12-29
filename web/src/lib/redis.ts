import Redis from 'ioredis';
import { env } from '~/env';

// Create Redis client
const redis = new Redis(env.REDIS_URL);

// Key prefix for Slack event deduplication
const SLACK_EVENT_PREFIX = 'slack:event:';

// TTL for deduplication keys (5 minutes)
const DEDUP_TTL = 5 * 60;

/**
 * Checks if a Slack event has already been processed using Redis for deduplication.
 * 
 * How it works:
 * 1. We try to SET a key in Redis with these options:
 *    - 'NX': Only set if key does Not eXist
 *    - 'EX': Set an EXpiration time in seconds
 * 
 * 2. The Redis SET command will:
 *    - Return 'OK' if the key was set (new event)
 *    - Return null if the key already exists (duplicate event)
 * 
 * 3. After DEDUP_TTL (5 minutes), Redis automatically deletes the key
 *    This prevents memory growth while keeping a window to catch duplicates
 * 
 * @param eventId - The Slack event ID to check
 * @returns true if event was already processed, false if it's new
 */
export async function isEventProcessed(eventId: string): Promise<boolean> {
  // Create a unique key for this event
  const key = SLACK_EVENT_PREFIX + eventId;
  
  // Try to SET the key in Redis
  // - key: unique identifier for this event
  // - '1': arbitrary value (doesn't matter)
  // - 'EX': set expiration
  // - DEDUP_TTL: expire after 5 minutes
  // - 'NX': only set if key doesn't exist
  const result = await redis.set(key, '1', 'EX', DEDUP_TTL, 'NX');

  // If result is null: key already exists (duplicate event)
  // If result is 'OK': key was set (new event)
  return result === null;
}

export { redis }; 