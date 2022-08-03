import { ConflictException } from "@nestjs/common";

export class ExistedException extends ConflictException {
  constructor(public message: string) {
    super(message);
  }
}
