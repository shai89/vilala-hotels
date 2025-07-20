-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "alt_text" TEXT,
    "title" TEXT,
    "description" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "quality_score" DOUBLE PRECISION,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "processing_status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_publicId_key" ON "images"("publicId");

-- CreateIndex
CREATE INDEX "images_entity_type_entity_id_idx" ON "images"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "images_is_cover_idx" ON "images"("is_cover");

-- CreateIndex
CREATE INDEX "images_sort_order_idx" ON "images"("sort_order");
