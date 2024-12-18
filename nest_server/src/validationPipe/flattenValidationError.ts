import { ValidationError } from 'class-validator';

export function flattenValidationError(
  errors: ValidationError[],
  parentPath = '',
): { field: string; message: string }[] {
  const result = [];
  errors.forEach((error) => {
    const currPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    if (error.constraints) {
      Object.values(error.constraints).forEach((msg) => {
        result.push({ field: currPath, message: msg });
      });
    }
    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationError(error.children, currPath));
    }
  });
  return result;
}
