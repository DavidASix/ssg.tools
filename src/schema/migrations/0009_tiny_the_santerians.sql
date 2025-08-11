ALTER TABLE "user"
ADD COLUMN "has_active_subscription" boolean DEFAULT false NOT NULL;

-- Update has_active_subscription based on current subscription status
-- NOTE: This is not perfect, as someone could have subscribed then cancelled
-- but still be within their subscription period. This logic only checks if
-- the current date falls within any subscription period for the user.
-- This doesn't matter at time of writing as we haven't shipped the cancel subscription feature yet.
UPDATE "user"
SET
  "has_active_subscription" = true
WHERE
  "id" IN (
    SELECT DISTINCT
      sp.user_id
    FROM
      subscription_payments sp
    WHERE
      NOW() BETWEEN sp.subscription_start AND sp.subscription_end
  );