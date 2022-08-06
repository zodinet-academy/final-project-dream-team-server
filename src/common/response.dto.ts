import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T> {
  @ApiProperty({ example: "true/false", type: Boolean, required: false })
  status: boolean;

  @ApiProperty({ example: "Unsuccess", type: String, required: false })
  message: string;

  @ApiProperty({ example: null, required: false })
  data?: T | T[];

  @ApiProperty({ example: "ERROR_UNKNOWN", type: String, required: false })
  error: string;
}
