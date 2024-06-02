/*
  Warnings:

  - You are about to drop the column `email` on the `persons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "persons_email_key";

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
