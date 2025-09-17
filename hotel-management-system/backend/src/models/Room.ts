import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import RoomType from './RoomType';
import Reservation from './Reservation';
import RoomStatus from '../enums/RoomStatus';

interface RoomAttributes {
  id: number;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomTypeId: number;
  roomType?: RoomType;
  maxOccupancy: number;
  features: string[];
  maintenanceNotes: string | null;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
  isSmokingAllowed: boolean;
  isPetFriendly: boolean;
  isAccessible: boolean;
  view: string | null;
  housekeepingStatus: string;
  housekeepingNotes: string | null;
  lastCleanedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  reservations?: Reservation[];
}

type RoomCreationAttributes = Optional<
  RoomAttributes,
  'id' | 'status' | 'features' | 'maintenanceNotes' | 'lastMaintenanceDate' | 
  'nextMaintenanceDate' | 'isSmokingAllowed' | 'isPetFriendly' | 'isAccessible' | 
  'view' | 'housekeepingStatus' | 'housekeepingNotes' | 'lastCleanedAt' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'rooms',
  timestamps: true,
  underscored: true,
})
class Room extends Model<RoomAttributes, RoomCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    unique: true,
    field: 'room_number',
  })
  roomNumber!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  })
  floor!: number;

  @Column({
    type: DataType.ENUM(
      'AVAILABLE',
      'OCCUPIED',
      'MAINTENANCE',
      'CLEANING',
      'OUT_OF_SERVICE',
      'RESERVED'
    ),
    allowNull: false,
    defaultValue: 'AVAILABLE',
  })
  status!: RoomStatus;

  @ForeignKey(() => RoomType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'room_type_id',
  })
  roomTypeId!: number;

  @BelongsTo(() => RoomType)
  roomType!: RoomType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'max_occupancy',
    validate: {
      min: 1,
    },
  })
  maxOccupancy!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  features!: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'maintenance_notes',
  })
  maintenanceNotes!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_maintenance_date',
  })
  lastMaintenanceDate!: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'next_maintenance_date',
  })
  nextMaintenanceDate!: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_smoking_allowed',
  })
  isSmokingAllowed!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_pet_friendly',
  })
  isPetFriendly!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_accessible',
  })
  isAccessible!: boolean;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  view!: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'CLEAN',
    field: 'housekeeping_status',
  })
  housekeepingStatus!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'housekeeping_notes',
  })
  housekeepingNotes!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_cleaned_at',
  })
  lastCleanedAt!: Date | null;

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
  isAvailable(checkIn: Date, checkOut: Date): Promise<boolean> {
    // Implementation to check room availability for given dates
    // This would check for any overlapping reservations
    return Promise.resolve(true);
  }

  updateStatus(newStatus: RoomStatus, notes?: string): void {
    this.status = newStatus;
    if (notes) {
      this.maintenanceNotes = notes;
    }
  }

  scheduleMaintenance(scheduledDate: Date, notes?: string): void {
    this.status = 'MAINTENANCE';
    this.nextMaintenanceDate = scheduledDate;
    if (notes) {
      this.maintenanceNotes = notes;
    }
  }
}

export default Room;
