type Nullable<T> = T | null | undefined;

export class AthenaError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'AthenaError';
  }
}

/**
 * Throw error if null or undefined
 */
export function ThrowErrorIfNull<T> (value: Nullable<T> , error: string): T {
  if (value == null) {
    throw new AthenaError(
      '\n\n' +
      '〓[ ERROR ]〓 ' + error + '\n'
    );
  }
  return value;
}
