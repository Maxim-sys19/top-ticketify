export class Result<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly error?: string,
    public readonly value?: T,
  ) {}
  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }
  static fail<U>(message: string): Result<U> {
    return new Result<U>(false, message);
  }
}
