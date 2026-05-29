type ApiErrorBody = {
  message?: string;
  errors?: { field: string; message: string }[];
};

type ApiErrorLike = {
  data?: ApiErrorBody;
  status?: number;
};

export function logDevError(context: string, error: unknown) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.error(`[${context}]`, error);

  if (typeof error === "object" && error !== null && "data" in error) {
    console.error(`[${context}] response:`, (error as ApiErrorLike).data);
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return fallback;
  }

  const data = (error as ApiErrorLike).data;

  if (data?.errors?.length) {
    return data.errors.map((item) => `${item.field}: ${item.message}`).join(", ");
  }

  return data?.message || fallback;
}
