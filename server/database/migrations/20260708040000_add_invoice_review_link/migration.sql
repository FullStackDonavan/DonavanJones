-- AlterTable: Review can now belong to either a product purchase (userId +
-- productSlug) or a paid invoice (invoiceId), so the product-review columns
-- become optional.
ALTER TABLE "Review" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Review" ALTER COLUMN "productSlug" DROP NOT NULL;
ALTER TABLE "Review" ADD COLUMN "invoiceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Review_invoiceId_key" ON "Review"("invoiceId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: private token used to let an invoice's client leave a review
-- without needing a site account (default covers any existing rows).
ALTER TABLE "Invoice" ADD COLUMN "reviewToken" TEXT NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text);
ALTER TABLE "Invoice" ALTER COLUMN "reviewToken" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_reviewToken_key" ON "Invoice"("reviewToken");
