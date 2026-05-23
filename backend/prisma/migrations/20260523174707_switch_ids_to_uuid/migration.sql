/*
  Warnings:

  - The primary key for the `attendance_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `attendances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `teacher_id` column on the `classes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `fee_payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `received_by_id` column on the `fee_payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teacher_class_assignments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `attendance_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `attendance_id` on the `attendance_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `student_id` on the `attendance_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `attendances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `class_id` on the `attendances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taken_by_id` on the `attendances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `fee_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `student_id` on the `fee_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `class_id` on the `fee_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `refresh_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `refresh_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `settings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `class_id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `teacher_class_assignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teacher_id` on the `teacher_class_assignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `class_id` on the `teacher_class_assignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `assigned_by_id` on the `teacher_class_assignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `teachers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `teachers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_attendance_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_student_id_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_class_id_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_taken_by_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_received_by_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_class_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_class_assignments" DROP CONSTRAINT "teacher_class_assignments_assigned_by_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_class_assignments" DROP CONSTRAINT "teacher_class_assignments_class_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_class_assignments" DROP CONSTRAINT "teacher_class_assignments_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_user_id_fkey";

-- AlterTable
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "attendance_id",
ADD COLUMN     "attendance_id" UUID NOT NULL,
DROP COLUMN "student_id",
ADD COLUMN     "student_id" UUID NOT NULL,
ADD CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "class_id",
ADD COLUMN     "class_id" UUID NOT NULL,
DROP COLUMN "taken_by_id",
ADD COLUMN     "taken_by_id" UUID NOT NULL,
ADD CONSTRAINT "attendances_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "classes" DROP CONSTRAINT "classes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" UUID,
ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fee_payments" DROP CONSTRAINT "fee_payments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "student_id",
ADD COLUMN     "student_id" UUID NOT NULL,
DROP COLUMN "class_id",
ADD COLUMN     "class_id" UUID NOT NULL,
DROP COLUMN "received_by_id",
ADD COLUMN     "received_by_id" UUID,
ADD CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "settings" DROP CONSTRAINT "settings_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "class_id",
ADD COLUMN     "class_id" UUID NOT NULL,
ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teacher_class_assignments" DROP CONSTRAINT "teacher_class_assignments_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "teacher_id",
ADD COLUMN     "teacher_id" UUID NOT NULL,
DROP COLUMN "class_id",
ADD COLUMN     "class_id" UUID NOT NULL,
DROP COLUMN "assigned_by_id",
ADD COLUMN     "assigned_by_id" UUID NOT NULL,
ADD CONSTRAINT "teacher_class_assignments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_attendance_id_student_id_key" ON "attendance_records"("attendance_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_class_id_date_key" ON "attendances"("class_id", "date");

-- CreateIndex
CREATE INDEX "fee_payments_class_id_idx" ON "fee_payments"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_student_id_month_year_key" ON "fee_payments"("student_id", "month", "year");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- CreateIndex
CREATE INDEX "teacher_class_assignments_teacher_id_status_idx" ON "teacher_class_assignments"("teacher_id", "status");

-- CreateIndex
CREATE INDEX "teacher_class_assignments_class_id_status_idx" ON "teacher_class_assignments"("class_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_taken_by_id_fkey" FOREIGN KEY ("taken_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
