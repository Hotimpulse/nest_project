/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Should be an email' })
  readonly email: string;
  @ApiProperty({ example: 'test123', description: 'User password' })
  @IsString({ message: 'Should be a string' })
  @Length(4, 16, { message: 'Should be over 4 and under 16 symbols' })
  readonly password: string;
}
