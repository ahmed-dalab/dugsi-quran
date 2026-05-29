import type { EmploymentType } from "../../generated/prisma";
import { fromEmploymentType, toEmploymentType } from "./enumMappers";
import { serializeEntity } from "./serialize";

type RelationMap = Record<string, string>;

export const flattenRelations = <T extends Record<string, unknown>>(
  entity: T,
  relations: RelationMap
) => {
  const flattened = { ...entity } as Record<string, unknown>;

  for (const [relationKey, targetKey] of Object.entries(relations)) {
    const relationValue = flattened[relationKey];

    if (relationValue !== undefined) {
      flattened[targetKey] = relationValue ?? flattened[targetKey];
      delete flattened[relationKey];
    }
  }

  return flattened;
};

export const mapEntityWithRelations = <T extends Record<string, unknown>>(
  entity: T,
  relations: RelationMap
) => serializeEntity(flattenRelations(entity, relations));


type EmergencyContactInput = {
  name?: string;
  phone?: string;
  relationship?: string;
};

export const mapEmergencyContactToDb = (contact?: EmergencyContactInput) => {
  if (!contact) {
    return {};
  }

  return {
    ...(contact.name !== undefined ? { emergencyContactName: contact.name || null } : {}),
    ...(contact.phone !== undefined ? { emergencyContactPhone: contact.phone || null } : {}),
    ...(contact.relationship !== undefined
      ? { emergencyContactRelationship: contact.relationship || null }
      : {}),
  };
};

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

export const mapStudentRecord = <T extends { class?: unknown; classId?: unknown }>(student: T) =>
  mapEntityWithRelations(student as Record<string, unknown>, { class: "classId" });

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
) =>
  mapEntityWithRelations(fee as Record<string, unknown>, {
    student: "studentId",
    class: "classId",
    receivedBy: "receivedById",
  });

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
  const mapped = mapEntityWithRelations(attendance as Record<string, unknown>, {
    class: "classId",
    takenBy: "takenById",
  });

  return {
    ...mapped,
    records: ((attendance.records ?? []) as Array<{
      student?: unknown;
      studentId?: unknown;
      status: string;
      note?: string | null;
    }>).map((record) => ({
      studentId: record.student ?? record.studentId,
      status: record.status,
      note: record.note ?? undefined,
    })),
  };
};

export { toEmploymentType };
