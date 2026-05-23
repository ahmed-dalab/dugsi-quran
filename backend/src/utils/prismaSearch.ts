export const buildPrismaOrSearch = (search: string | undefined, fields: string[]) => {
  if (!search?.trim() || fields.length === 0) {
    return undefined;
  }

  const term = search.trim();

  return {
    OR: fields.map((field) => ({
      [field]: { contains: term, mode: "insensitive" as const },
    })),
  };
};
