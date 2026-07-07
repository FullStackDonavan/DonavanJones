/*
  Warnings:

  - You are about to drop the `InsuranceSales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestAnotherMigration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestMigration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InsuranceSales" DROP CONSTRAINT "InsuranceSales_sellerId_fkey";

-- DropTable
DROP TABLE "InsuranceSales";

-- DropTable
DROP TABLE "TestAnotherMigration";

-- DropTable
DROP TABLE "TestMigration";

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePriceId" TEXT,
    "amountTotal" INTEGER,
    "currency" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_stripeSessionId_key" ON "Purchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Purchase_email_idx" ON "Purchase"("email");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
