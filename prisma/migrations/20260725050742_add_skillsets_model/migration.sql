-- CreateTable
CREATE TABLE "skillsets" (
    "id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "category_order" INTEGER NOT NULL DEFAULT 1,
    "link" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skillsets_pkey" PRIMARY KEY ("id")
);
