/*
  Warnings:

  - You are about to drop the column `cpu_extra_time` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `cpu_time_limit` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `max_processes_and_or_threads` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `memory_limit` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `stack_limit` on the `submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT DEFAULT 'Coder';

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "cpu_extra_time",
DROP COLUMN "cpu_time_limit",
DROP COLUMN "max_processes_and_or_threads",
DROP COLUMN "memory_limit",
DROP COLUMN "stack_limit";
