-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "quotes" TEXT,
ADD COLUMN     "resume" TEXT;

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gmail" TEXT,
    "whatsapp" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_user_id_key" ON "contacts"("user_id");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
