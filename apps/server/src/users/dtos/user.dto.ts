import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  email!: string;

  @Expose()
  @Transform(({ key, obj }) => obj[key])
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  isAdmin!: boolean;

  @Expose()
  accessToken?: string;
}
