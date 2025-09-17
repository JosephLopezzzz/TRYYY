import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import Guest from './Guest';
import Room from './Room';
import ReservationStatus from '../enums/ReservationStatus';
import Payment from './Payment';

interface ReservationAttributes {
  id: number;
  reservationNumber: string;
  guestId: number;
  guest?: Guest;
  roomId: number;
  room?: Room;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  status: ReservationStatus;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  specialRequests: string | null;
  source: string;
  isWalkIn: boolean;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
}

type ReservationCreationAttributes = Optional<
  ReservationAttributes,
  'id' | 'reservationNumber' | 'status' | 'totalAmount' | 'paidAmount' | 'balance' | 
  'specialRequests' | 'source' | 'isWalkIn' | 'cancellationReason' | 'cancelledAt' | 
  'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'reservations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['reservation_number'],
    },
    {
      fields: ['check_in_date', 'check_out_date', 'status'],
    },
  ],
})
class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
    field: 'reservation_number',
    defaultValue: () => `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  })
  reservationNumber!: string;

  @ForeignKey(() => Guest)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'guest_id',
  })
  guestId!: number;

  @BelongsTo(() => Guest)
  guest!: Guest;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'room_id',
  })
  roomId!: number;

  @BelongsTo(() => Room)
  room!: Room;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'check_in_date',
  })
  checkInDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'check_out_date',
    validate: {
      isAfterCheckInDate(value: Date) {
        if (value <= this.checkInDate) {
          throw new Error('Check-out date must be after check-in date');
        }
      },
    },
  })
  checkOutDate!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  })
  adults!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  children!: number;

  @Column({
    type: DataType.ENUM(
      'PENDING',
      'CONFIRMED',
      'CHECKED_IN',
      'CHECKED_OUT',
      'CANCELLED',
      'NO_SHOW'
    ),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status!: ReservationStatus;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount',
    validate: {
      min: 0,
    },
  })
  totalAmount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'paid_amount',
    validate: {
      min: 0,
      isLessThanOrEqualToTotalAmount(value: number) {
        if (value > this.totalAmount) {
          throw new Error('Paid amount cannot exceed total amount');
        }
      },
    },
  })
  paidAmount!: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.totalAmount - this.paidAmount;
    },
    set() {
      throw new Error('Do not set balance directly, it is calculated from total and paid amounts');
    },
  })
  balance!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'special_requests',
  })
  specialRequests!: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'WEBSITE',
  })
  source!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_walk_in',
  })
  isWalkIn!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'cancellation_reason',
  })
  cancellationReason!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'cancelled_at',
  })
  cancelledAt!: Date | null;

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
  @HasMany(() => Payment)
  payments!: Payment[];

  // Helper methods
  get nights(): number {
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotal(roomRate: number, taxRate: number = 0.1): number {
    const subtotal = roomRate * this.nights;
    const tax = subtotal * taxRate;
    return subtotal + tax;
  }

  async addPayment(amount: number, paymentMethod: string, notes?: string): Promise<Payment> {
    // This would be implemented with the Payment model
    // For now, just update the paid amount
    this.paidAmount = Number(this.paidAmount) + Number(amount);
    await this.save();
    
    // In a real implementation, we would create a Payment record here
    return {} as Payment;
  }

  async cancel(reason: string): Promise<void> {
    this.status = 'CANCELLED';
    this.cancellationReason = reason;
    this.cancelledAt = new Date();
    await this.save();
  }
}

export default Reservation;
