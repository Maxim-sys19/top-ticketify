export type ResultSuccessType<U> = Result<U>;

export class Result<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly error?: string,
    public readonly value?: T,
  ) {}
  static ok<U>(value: U): ResultSuccessType<U> {
    return new Result<U>(true, undefined, value);
  }
  static fail<U>(message: string): Result<U> {
    return new Result<U>(false, message);
  }
}
