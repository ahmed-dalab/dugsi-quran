# Dugsi Quran Backend

A backend API for managing a Quranic school (dugsi / madrasa) with a clean modular architecture using **Node.js**, **Express**, **TypeScript**, and **MongoDB/Mongoose**.

The goal of this project is to build a focused, extensible school management system around a small but important operational core:

* Student management
* Attendance tracking
* Fee management
* Authentication and user access control

This project intentionally starts small so that the foundation remains clean, maintainable, and ready for future modules.

---

# Project Vision

This system is designed for a Quranic school that currently needs only a few essential functions:

* Manage students
* Record class attendance
* Track fee payments
* Allow authenticated staff access

The current school structure assumes:

* The madrasa has **3 classes**
* Each class has **1 teacher**

Even though that is the current real-world setup, the system should **not hardcode those limits**. The database design should allow the school to grow later without major restructuring.

---

# Why This Project Exists

Many small schools and madrasas still use:

* Paper registers
* WhatsApp messages
* Spreadsheets
* Manual fee notebooks

That works only for a short time.

As the number of students grows, these problems appear:

* Student records become inconsistent
* Attendance history is difficult to search
* Fee records are easy to lose or miscalculate
* There is no central source of truth
* Reporting becomes manual and error-prone

This backend is meant to solve that by providing a structured, future-ready API layer.

---

# Core Scope of the First Version

The first version focuses only on these modules:

## 1. Authentication

Responsible for:

* login
* account identity
* role-based access
* protecting private routes

## 2. Students

Responsible for:

* student registration
* assigning students to classes
* storing guardian contact details
* tracking active/inactive status

## 3. Attendance

Responsible for:

* daily attendance per class
* present/absent records
* attendance history lookup

## 4. Fees

Responsible for:

* fee amount due for each student
* payment recording
* partial or full payment tracking
* unpaid student visibility

## 5. Classes

Responsible for:

* class definition
* class name/order
* teacher assignment
* monthly fee defaults

## 6. Teachers

Responsible for:

* teacher profile management
* connecting teacher accounts to classes

---

# Architecture Approach

This backend uses a **modular architecture**.

Instead of putting everything into one large controllers folder or a flat MVC structure, the system is split by business domain.

Example structure:

```bash
src/
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.route.ts
      auth.validation.ts
      auth.types.ts

    user/
      user.model.ts
      user.types.ts
      user.constant.ts

    student/
    teacher/
    class/
    attendance/
    fee/

  shared/
    errors/
    middlewares/
    utils/
    interfaces/
    constants/
```

This approach improves:

* ownership clarity
* maintainability
* feature isolation
* long-term scalability

---

# Over-Engineered View of the Domain

To design this project well, we separate the system into logical layers.

## 1. Identity and Access Layer

This layer answers:

* Who can log in?
* What role do they have?
* Can they access this action?

Main entity:

* `User`

## 2. Academic/Operational Layer

This layer answers:

* Which student belongs to which class?
* Which teacher handles which class?
* What happened in attendance today?

Main entities:

* `Class`
* `Teacher`
* `Student`
* `Attendance`

## 3. Financial Layer

This layer answers:

* How much should each student pay?
* Has the student paid?
* Was the payment full, partial, or missing?

Main entity:

* `FeePayment`

This layered thinking helps prevent mixing responsibilities.

For example:

* `User` is for authentication, not teacher profile details
* `Teacher` is for teacher business data, not password handling
* `FeePayment` is for financial records, not attendance logic

---

# Entity Overview

## User

Represents a system account that can log in.

This is not the full teacher profile. It is only the identity used for authentication and authorization.

Typical roles:

* `admin`
* `teacher`

A user may later be linked to a teacher profile.

---

## Teacher

Represents the business profile of a teacher.

This exists separately from `User` because a teacher may need additional profile data later, such as:

* phone number
* employment status
* assigned class
* address

---

## Class

Represents a school class or learning group.

Each class:

* has a name
* may have one assigned teacher
* may define a monthly fee amount
* contains multiple students

---

## Student

Represents a student enrolled in the madrasa.

Each student:

* belongs to one class
* has guardian contact information
* can have many attendance records over time
* can have many fee records over time

---

## Attendance

Represents the attendance register for a class on a specific day.

This is best modeled as one attendance document per class per day containing multiple student records.

Why this design is useful:

* one teacher opens one attendance sheet
* all students are marked together
* lookup is easier by class and date

---

## FeePayment

Represents a student’s fee state for a specific month and year.

It stores:

* how much is due
* how much was paid
* payment status
* who recorded the payment

This is more flexible than a simple paid/unpaid flag because it supports partial payment.

---

# Business Rules

## Authentication Rules

* Only registered users can log in
* Users must have a role
* Inactive users should not be allowed to access protected routes

## Student Rules

* Every student must belong to one class
* Students should not be deleted casually; inactive status is safer

## Attendance Rules

* Only one attendance sheet per class per date
* Attendance should include students from that class only
* Teachers should only mark attendance for their own class

## Fee Rules

* One fee record per student per month and year
* Payment status should be derived from `amountDue` and `amountPaid`
* Historical fee records should not be deleted

---

# Current and Planned Modules

## Implemented / Starting

* Express + TypeScript backend setup
* MongoDB/Mongoose connection
* User model for authentication foundation

## Planned Next

* Auth module
* Class module
* Teacher module
* Student module
* Attendance module
* Fee module

## Future Possibilities

* Parent portal
* SMS reminders
* Expense tracking
* Reports dashboard
* Quran progress tracking
* Exam and assessment management

---

# Suggested API Direction

## Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

## Classes

* `GET /api/classes`
* `POST /api/classes`
* `PATCH /api/classes/:id`

## Teachers

* `GET /api/teachers`
* `POST /api/teachers`
* `PATCH /api/teachers/:id`

## Students

* `GET /api/students`
* `POST /api/students`
* `PATCH /api/students/:id`

## Attendance

* `POST /api/attendance`
* `GET /api/attendance?classId=...&date=...`
* `GET /api/attendance/history?classId=...`

## Fees

* `POST /api/fees/payments`
* `GET /api/fees/payments?studentId=...`
* `GET /api/fees/unpaid?classId=...&month=...&year=...`

---

# Tables / Collections and Their Columns

Below is the logical table design. Since the project uses MongoDB, these are technically **collections and document fields**, but the structure is shown in table form for clarity.

## 1. users

| Column      | Type     | Required | Description                               |
| ----------- | -------- | -------: | ----------------------------------------- |
| `_id`       | ObjectId |      Yes | Unique identifier                         |
| `name`      | String   |      Yes | Full name of the account owner            |
| `email`     | String   |      Yes | Unique email used for login               |
| `password`  | String   |      Yes | Hashed password                           |
| `role`      | String   |      Yes | User role (`admin`, `teacher`)            |
| `isActive`  | Boolean  |      Yes | Whether the account can access the system |
| `createdAt` | Date     |      Yes | Record creation timestamp                 |
| `updatedAt` | Date     |      Yes | Record update timestamp                   |

## 2. teachers

| Column      | Type     | Required | Description               |
| ----------- | -------- | -------: | ------------------------- |
| `_id`       | ObjectId |      Yes | Unique identifier         |
| `userId`    | ObjectId |       No | Linked auth account       |
| `fullName`  | String   |      Yes | Teacher full name         |
| `phone`     | String   |      Yes | Teacher contact number    |
| `address`   | String   |       No | Teacher address           |
| `classId`   | ObjectId |       No | Assigned class            |
| `status`    | String   |      Yes | Employment/profile state  |
| `createdAt` | Date     |      Yes | Record creation timestamp |
| `updatedAt` | Date     |      Yes | Record update timestamp   |

## 3. classes

| Column       | Type     | Required | Description                        |
| ------------ | -------- | -------: | ---------------------------------- |
| `_id`        | ObjectId |      Yes | Unique identifier                  |
| `name`       | String   |      Yes | Class name                         |
| `levelOrder` | Number   |      Yes | Sort order / level sequence        |
| `teacherId`  | ObjectId |       No | Assigned teacher                   |
| `monthlyFee` | Number   |      Yes | Standard monthly fee               |
| `status`     | String   |      Yes | Class state (`active`, `inactive`) |
| `createdAt`  | Date     |      Yes | Record creation timestamp          |
| `updatedAt`  | Date     |      Yes | Record update timestamp            |

## 4. students

| Column             | Type     | Required | Description                          |
| ------------------ | -------- | -------: | ------------------------------------ |
| `_id`              | ObjectId |      Yes | Unique identifier                    |
| `fullName`         | String   |      Yes | Student full name                    |
| `gender`           | String   |      Yes | Student gender                       |
| `dateOfBirth`      | Date     |       No | Date of birth                        |
| `guardianName`     | String   |       No | Parent/guardian name                 |
| `guardianPhone`    | String   |      Yes | Parent/guardian phone                |
| `classId`          | ObjectId |      Yes | Assigned class                       |
| `registrationDate` | Date     |      Yes | Enrollment date                      |
| `status`           | String   |      Yes | Student state (`active`, `inactive`) |
| `createdAt`        | Date     |      Yes | Record creation timestamp            |
| `updatedAt`        | Date     |      Yes | Record update timestamp              |

## 5. attendances

| Column      | Type          | Required | Description                    |
| ----------- | ------------- | -------: | ------------------------------ |
| `_id`       | ObjectId      |      Yes | Unique identifier              |
| `classId`   | ObjectId      |      Yes | Class for the attendance sheet |
| `date`      | String / Date |      Yes | Attendance date                |
| `markedBy`  | ObjectId      |      Yes | User who recorded attendance   |
| `records`   | Array         |      Yes | Student attendance items       |
| `createdAt` | Date          |      Yes | Record creation timestamp      |
| `updatedAt` | Date          |      Yes | Record update timestamp        |

### attendance.records subfields

| Column      | Type     | Required | Description           |
| ----------- | -------- | -------: | --------------------- |
| `studentId` | ObjectId |      Yes | Student being marked  |
| `status`    | String   |      Yes | `present` or `absent` |

## 6. fee_payments

| Column        | Type     | Required | Description                    |
| ------------- | -------- | -------: | ------------------------------ |
| `_id`         | ObjectId |      Yes | Unique identifier              |
| `studentId`   | ObjectId |      Yes | Student reference              |
| `classId`     | ObjectId |      Yes | Class reference                |
| `month`       | Number   |      Yes | Payment month                  |
| `year`        | Number   |      Yes | Payment year                   |
| `amountDue`   | Number   |      Yes | Expected fee                   |
| `amountPaid`  | Number   |      Yes | Paid amount                    |
| `status`      | String   |      Yes | `paid`, `partial`, or `unpaid` |
| `paymentDate` | Date     |       No | Date payment was recorded      |
| `receivedBy`  | ObjectId |       No | User who recorded payment      |
| `note`        | String   |       No | Extra payment note             |
| `createdAt`   | Date     |      Yes | Record creation timestamp      |
| `updatedAt`   | Date     |      Yes | Record update timestamp        |

---

# Why This Design Is Not Random

This design deliberately separates concerns.

For example:

* `users` handle access
* `teachers` handle teacher profile data
* `students` handle enrollment and student identity
* `attendances` handle daily operational records
* `fee_payments` handle monthly financial state

That separation prevents the codebase from turning into a large, mixed, hard-to-maintain system.

---

# Development Philosophy

This project should be built with these principles:

1. Start with the smallest useful scope
2. Keep entity ownership clear
3. Avoid hardcoding business assumptions
4. Prefer status fields over deleting history
5. Separate authentication from business profiles
6. Design for growth without building everything now

---

# Summary

Dugsi Quran Backend is a focused madrasa management API that starts from operational basics and grows from a strong foundation.

Its initial goal is not to become a huge school ERP immediately.
Its goal is to solve the real daily workflow of a Quranic school in a maintainable and professional way.

The current design covers the essential core:

* users
* teachers
* classes
* students
* attendance
* fee payments

From here, the system can evolve safely into a broader education management platform.
