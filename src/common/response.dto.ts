export class ResponseDto<T> {
  status: boolean;
  message: string;
  data?: T | T[];
  error_code: string;
}
