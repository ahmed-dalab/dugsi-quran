type JsonRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);

/** Maps Prisma `id` to `_id` for API compatibility with the existing frontend. */
export const serializeEntity = <T>(entity: T): T => {
  if (entity instanceof Date) {
    return entity;
  }

  if (Array.isArray(entity)) {
    return entity.map((item) => serializeEntity(item)) as T;
  }

  if (!isPlainObject(entity)) {
    return entity;
  }

  const serialized: JsonRecord = {};

  for (const [key, value] of Object.entries(entity)) {
    if (key === "id") {
      serialized._id = value;
      continue;
    }

    serialized[key] = serializeEntity(value);
  }

  return serialized as T;
};

export const serializeList = <T>(items: T[]) => items.map((item) => serializeEntity(item));
