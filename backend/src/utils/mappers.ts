import type { EmploymentType } from "../../generated/prisma";
import { fromEmploymentType, toEmploymentType } from "./enumMappers";
import { serializeEntity } from "./serialize";

type EmergencyContactInput = {
  name?: string;
  phone?: string;
  relationship?: string;
};

export const mapEmergencyContactToDb = (contact?: EmergencyContactInput) => ({
  emergencyContactName: contact?.name,
  emergencyContactPhone: contact?.phone,
  emergencyContactRelationship: contact?.relationship,
});

export const mapEmergencyContactFromDb = (teacher: {
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
}) => ({
  name: teacher.emergencyContactName ?? undefined,
  phone: teacher.emergencyContactPhone ?? undefined,
  relationship: teacher.emergencyContactRelationship ?? undefined,
});

export const mapTeacherRecord = <
  T extends {
    employmentType?: EmploymentType | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelationship?: string | null;
    user?: unknown;
    userId?: unknown;
  },
>(
  teacher: T
) => {
  const {
    employmentType,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelationship,
    user,
    ...rest
  } = teacher;

  const mapped = {
    ...rest,
    employmentType: fromEmploymentType(employmentType),
    emergencyContact: mapEmergencyContactFromDb({
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    }),
    userId: user ?? rest.userId,
  };

  return serializeEntity(mapped);
};

export const mapStudentRecord = <T extends { class?: unknown; classId?: unknown }>(student: T) => {
  const { class: classRelation, ...rest } = student;

  return serializeEntity({
    ...rest,
    classId: classRelation ?? rest.classId,
  });
};

export const mapFeeRecord = <
  T extends {
    student?: unknown;
    class?: unknown;
    receivedBy?: unknown;
    studentId?: unknown;
    classId?: unknown;
    receivedById?: unknown;
  },
>(
  fee: T
) => {
  const { student, class: classRelation, receivedBy, ...rest } = fee;

  return serializeEntity({
    ...rest,
    studentId: student ?? rest.studentId,
    classId: classRelation ?? rest.classId,
    receivedBy: receivedBy ?? rest.receivedById,
  });
};

export const mapAssignmentRecord = <
  T extends {
    teacher?: {
      id?: string;
      userId?: unknown;
      user?: unknown;
    } | null;
    class?: unknown;
    assignedBy?: unknown;
    teacherId?: unknown;
    classId?: unknown;
    assignedById?: unknown;
  },
>(
  assignment: T
) => {
  const { teacher, class: classRelation, assignedBy, ...rest } = assignment;

  const teacherPayload = teacher
    ? serializeEntity({
        ...teacher,
        userId: teacher.user ?? teacher.userId,
      })
    : rest.teacherId;

  return serializeEntity({
    ...rest,
    teacherId: teacherPayload,
    classId: classRelation ?? rest.classId,
    assignedBy: assignedBy ?? rest.assignedById,
  });
};

export const mapAttendanceRecord = <
  T extends {
    class?: unknown;
    takenBy?: unknown;
    records?: Array<{
      student?: unknown;
      studentId?: unknown;
      status: string;
      note?: string | null;
    }>;
    classId?: unknown;
    takenById?: unknown;
  },
>(
  attendance: T
) => {
  const { class: classRelation, takenBy, records, ...rest } = attendance;

  return serializeEntity({
    ...rest,
    classId: classRelation ?? rest.classId,
    takenBy: takenBy ?? rest.takenById,
    records: (records ?? []).map((record) => ({
      studentId: record.student ?? record.studentId,
      status: record.status,
      note: record.note ?? undefined,
    })),
  });
};

export { toEmploymentType };
