import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import User from './User';
import { Optional } from 'sequelize';

interface RoleAttributes {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  isDefault: boolean;
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description' | 'isDefault' | 'createdAt' | 'updatedAt'>;

@Table({
  tableName: 'roles',
  timestamps: true,
  underscored: true,
})
class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description!: string | null;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  permissions!: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_default',
  })
  isDefault!: boolean;

  @HasMany(() => User)
  users!: User[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt!: Date;

  // Helper methods
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  addPermission(permission: string): void {
    if (!this.hasPermission(permission)) {
      this.permissions = [...this.permissions, permission];
    }
  }

  removePermission(permission: string): void {
    this.permissions = this.permissions.filter(p => p !== permission);
  }
}

export default Role;
