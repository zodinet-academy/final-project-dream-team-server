import { ApiProperty } from "@nestjs/swagger";
import { CodeStatus } from "src/constants";

export class ResponseDto<T> {
  @ApiProperty({ example: 0, type: CodeStatus, required: false })
  code: number;

  @ApiProperty({ example: "Unsuccess", type: String, required: false })
  message: string;

  @ApiProperty({ example: null, required: false })
  data?: T | T[];

  @ApiProperty({ example: "ERROR_UNKNOWN", type: String, required: false })
  error: string;
}
