import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Room from './Room';

interface RoomTypeAttributes {
  id: number;
  name: string;
  description: string | null;
  baseRate: number;
  maxOccupancy: number;
  bedType: string;
  bedCount: number;
  size: number | null;
  amenities: string[];
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  rooms?: Room[];
}

type RoomTypeCreationAttributes = Optional<
  RoomTypeAttributes,
  'id' | 'description' | 'size' | 'imageUrl' | 'isActive' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'room_types',
  timestamps: true,
  underscored: true,
})
class RoomType extends Model<RoomTypeAttributes, RoomTypeCreationAttributes> {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'base_rate',
    validate: {
      min: 0,
    },
  })
  baseRate!: number;

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
    type: DataType.STRING(50),
    allowNull: false,
    field: 'bed_type',
  })
  bedType!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'bed_count',
    validate: {
      min: 1,
    },
  })
  bedCount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Room size in square meters',
  })
  size!: number | null;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  amenities!: string[];

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'image_url',
    validate: {
      isUrl: true,
    },
  })
  imageUrl!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive!: boolean;

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
  @HasMany(() => Room)
  rooms!: Room[];

  // Helper methods
  calculateTotalBeds(): number {
    return this.bedCount;
  }

  hasAmenity(amenity: string): boolean {
    return this.amenities.includes(amenity);
  }

  addAmenity(amenity: string): void {
    if (!this.hasAmenity(amenity)) {
      this.amenities = [...this.amenities, amenity];
    }
  }

  removeAmenity(amenity: string): void {
    this.amenities = this.amenities.filter(a => a !== amenity);
  }
}

export default RoomType;
