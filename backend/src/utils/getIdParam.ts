export const getIdParam = (id: string | string[] | undefined) => {
  if (Array.isArray(id)) {
    return id[0];
  }

  return id ?? "";
};
