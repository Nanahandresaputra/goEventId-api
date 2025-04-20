import * as bcrypt from 'bcryptjs';

export const encryptPwd = (pwd: string): string => {
  const salt: string = bcrypt.genSaltSync(10);
  const hash: string = bcrypt.hashSync(pwd, salt);

  return hash;
};

export const checkEncrypt = (pwd: string, hash: string): boolean => {
  // const salt: string = bcrypt.genSaltSync(10);
  // const hash: string = bcrypt.hashSync(pwd, salt);

  const compared: boolean = bcrypt.compareSync(pwd, hash);

  return compared;
};
