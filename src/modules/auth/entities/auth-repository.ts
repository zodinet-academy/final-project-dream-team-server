import { SignUpDto } from "../dto";
import { AuthEntity } from "./auth.entity";

export interface IAuthRepository {
  signUp(signUpDto: SignUpDto): Promise<AuthEntity>;
}
