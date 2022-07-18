export class AthenaError extends Error {
  constructor(type: string, msg?: string) {
    super(msg);
    this.name = type;
  }
}

export class NullValueError extends AthenaError {
  constructor() {
    super('NULL_VALUE_ERROR')
  }
}
