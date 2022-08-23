import { HttpException, HttpStatus } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new HttpException(
        "Only .png, .jpg and .jpeg format allowed!",
        HttpStatus.NOT_ACCEPTABLE
      ),
      false
    );
  }
  callback(null, true);
};
