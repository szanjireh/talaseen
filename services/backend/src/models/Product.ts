import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum ProductCategory {
  NECKLACE = 'necklace',
  RING = 'ring',
  BRACELET = 'bracelet',
  EARRING = 'earring',
  BANGLE = 'bangle',
  PENDANT = 'pendant',
  ANKLET = 'anklet',
  CHAIN = 'chain',
  OTHER = 'other'
}

export enum GoldPurity {
  KARAT_24 = '24k',
  KARAT_22 = '22k',
  KARAT_21 = '21k',
  KARAT_18 = '18k',
  KARAT_14 = '14k'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'enum', enum: GoldPurity })
  goldPurity: GoldPurity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number; // in grams

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number; // in Tomans

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  sku: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendorId' })
  vendor: User;

  @Column()
  vendorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
