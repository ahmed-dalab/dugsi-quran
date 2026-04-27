import { isValidObjectId } from "mongoose";
import { ClassModel, type IClass } from "./class.model";

type CreateClassPayload = IClass;
type UpdateClassPayload = Partial<IClass>;

const sanitizeClass = (classItem: unknown) => {
  if (
    typeof classItem === "object" &&
    classItem !== null &&
    "toObject" in classItem &&
    typeof classItem.toObject === "function"
  ) {
    return classItem.toObject() as Record<string, unknown>;
  }

  return classItem as Record<string, unknown>;
};

export const createClassService = async (payload: CreateClassPayload) => {
  const classItem = await ClassModel.create(payload);
  return sanitizeClass(classItem);
};

export const getClassesService = async () => {
  const classes = await ClassModel.find().sort({ levelOrder: 1 }).lean();
  return classes.map((classItem) => sanitizeClass(classItem));
};

export const getClassByIdService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findById(id).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};

export const updateClassService = async (id: string, payload: UpdateClassPayload) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};

export const deleteClassService = async (id: string) => {
  if (!isValidObjectId(id)) {
    return null;
  }

  const classItem = await ClassModel.findByIdAndDelete(id).lean();

  if (!classItem) {
    return null;
  }

  return sanitizeClass(classItem);
};
