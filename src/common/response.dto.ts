export class ResponseDto<T> {
  status: boolean;
  message: string;
  data?: T;
  error_code?: string | number;
}
