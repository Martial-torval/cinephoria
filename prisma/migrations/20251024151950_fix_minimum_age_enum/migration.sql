/*
  Warnings:

  - The values [en_attente,r,solu] on the enum `MinimumAge` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MinimumAge_new" AS ENUM ('AGE_0', 'AGE_10', 'AGE_12', 'AGE_16', 'AGE_18');
ALTER TABLE "public"."Movie" ALTER COLUMN "minimumAge" TYPE "public"."MinimumAge_new" USING ("minimumAge"::text::"public"."MinimumAge_new");
ALTER TYPE "public"."MinimumAge" RENAME TO "MinimumAge_old";
ALTER TYPE "public"."MinimumAge_new" RENAME TO "MinimumAge";
DROP TYPE "public"."MinimumAge_old";
COMMIT;
