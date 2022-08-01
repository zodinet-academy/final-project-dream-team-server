import { ConflictException } from "@nestjs/common";

export class ExistedException extends ConflictException {
  constructor(message: string) {
    super(message, " is EXISTED!");
  }
}
