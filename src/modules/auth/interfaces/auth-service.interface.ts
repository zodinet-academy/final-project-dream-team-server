import { SignUpDto } from "../dto";
import { AuthEntity } from "../entities/auth.entity";

export interface IAuthService {
  signUp(signUpDto: SignUpDto): Promise<AuthEntity>;
}
