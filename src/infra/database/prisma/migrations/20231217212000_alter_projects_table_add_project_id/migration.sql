/*
  Warnings:

  - A unique constraint covering the columns `[project_id]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - The required column `project_id` was added to the `projects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "project_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_project_id_key" ON "projects"("project_id");
