export type ValidationError = {
  field: string;
  message: string;
};

function isValidationErrorArray(error: any): error is ValidationError[] {
  return (
    Array.isArray(error) &&
    error.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.field === 'string' &&
        typeof item.message === 'string'
    )
  );
}

export const parseErrors = (error: unknown) => {
  if (isValidationErrorArray(error)) {
    return error;
  }
  // return [{field: 'unknown', message: 'An unexpected error occurred'}];
}