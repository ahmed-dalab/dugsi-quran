# dugsi-quran

Entities:

User Entity
Teacher Entity 
Class Entity
Student Entity
Attendance Entity
FeePayment

Core entities

Here is the clean domain model.

1. User

This is for login.

Fields:

_id
name
email or username
passwordHash
role: admin | teacher
teacherId nullable
createdAt
updatedAt
2. Teacher

Fields:

_id
fullName
phone
address optional
classId
status
createdAt
updatedAt

Since each class has one teacher, you can link teacher to class.

3. Class

Fields:

_id
name
levelOrder
teacherId
monthlyFee
createdAt
updatedAt

Example:

Class 1
Class 2
Class 3
4. Student

Fields:

_id
fullName
gender
dateOfBirth optional
guardianName optional
guardianPhone
classId
registrationDate
status: active | inactive
createdAt
updatedAt
5. Attendance

You have two ways to design this.

Better way for your case:

One document per class per day.

Fields:

_id
classId
date
markedBy
records: [
{
studentId,
status
}
]
createdAt
updatedAt

Why this is good:

teacher opens one class for one day
marks all students once
easier for attendance screen
6. FeePayment

Fields:

_id
studentId
classId
month
year
amountDue
amountPaid
status: paid | partial | unpaid
paymentDate
receivedBy
note optional
createdAt
updatedAt