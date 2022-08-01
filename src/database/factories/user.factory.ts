import { define } from "typeorm-seeding";

import { UserEntity } from "../../modules/users/entities/user.entity";
import { GenderType } from "../../constants";
define(UserEntity, (faker) => {
  const user = new UserEntity();
  user.nickname = faker.internet.userName();
  user.fullname = faker.internet.userName();
  user.phone = faker.phone.phoneNumber();
  user.gender = GenderType.MALE;

  return user;
});
