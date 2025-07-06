ALTER TABLE "businesses"
RENAME COLUMN "business_name" TO "name";

ALTER TABLE "businesses"
ADD COLUMN "address" text;