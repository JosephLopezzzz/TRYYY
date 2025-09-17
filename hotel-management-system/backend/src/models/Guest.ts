import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Reservation from './Reservation';

interface GuestAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  idType: string | null;
  idNumber: string | null;
  nationality: string | null;
  preferences: Record<string, any>;
  isVip: boolean;
  vipLevel: number | null;
  company: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  reservations?: Reservation[];
}

type GuestCreationAttributes = Optional<
  GuestAttributes,
  'id' | 'dateOfBirth' | 'address' | 'city' | 'country' | 'postalCode' | 'idType' | 
  'idNumber' | 'nationality' | 'preferences' | 'isVip' | 'vipLevel' | 'company' | 
  'notes' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'guests',
  timestamps: true,
  underscored: true,
})
class Guest extends Model<GuestAttributes, GuestCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'first_name',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'last_name',
  })
  lastName!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'phone_number',
  })
  phoneNumber!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
  })
  dateOfBirth!: Date | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  address!: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city!: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  country!: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'postal_code',
  })
  postalCode!: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'id_type',
  })
  idType!: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'id_number',
  })
  idNumber!: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  nationality!: string | null;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: {},
  })
  preferences!: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_vip',
  })
  isVip!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'vip_level',
    validate: {
      min: 1,
      max: 5,
    },
  })
  vipLevel!: number | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  company!: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes!: string | null;

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

  // Associations
  @HasMany(() => Reservation)
  reservations!: Reservation[];

  // Helper methods
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updatePreferences(newPreferences: Record<string, any>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }
}

export default Guest;
