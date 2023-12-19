-- DropForeignKey
ALTER TABLE "entries" DROP CONSTRAINT "entries_project_id_fkey";

-- DropForeignKey
ALTER TABLE "EntryShape" DROP CONSTRAINT "EntryShape_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "EntryRelations" DROP CONSTRAINT "EntryRelations_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "EntryData" DROP CONSTRAINT "EntryData_entry_id_fkey";

-- DropTable
DROP TABLE "entries";

-- DropTable
DROP TABLE "EntryShape";

-- DropTable
DROP TABLE "EntryRelations";

-- DropTable
DROP TABLE "EntryData";

