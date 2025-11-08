import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

interface UserCreationsAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationsAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  declare id: number;
  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;
  @ApiProperty({ example: 'test123', description: 'User password' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;
  @ApiProperty({ example: 'true', description: 'Was a user banned or not' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare banned: boolean;
  @ApiProperty({
    example: 'This user was banned because he was too cool for school',
    description: 'Reason for a user being banned',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  declare roles: Role[];
}
