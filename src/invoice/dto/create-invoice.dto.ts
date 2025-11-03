import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateInvoice } from 'src/types/StateInvoice';

export class CreateInvoiceDetailDto {
  @ApiProperty({
    description: 'Descripción del producto o servicio',
    example: 'Laptop HP Pavilion 15',
    maxLength: 500,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(500, {
    message: 'La descripción no puede exceder los 500 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Cantidad de productos o unidades',
    example: 2.5,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto o servicio',
    example: 1500.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0.01, { message: 'El precio unitario debe ser mayor a 0' })
  unitPrice: number;

  @ApiProperty({
    description: 'Subtotal de la línea (cantidad × precio unitario)',
    example: 3750.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @Min(0.01, { message: 'El subtotal debe ser mayor a 0' })
  subtotal: number;
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Número de factura único',
    example: 'FAC-2025-0001',
    maxLength: 50,
  })
  @IsString({ message: 'El número de factura debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de factura es obligatorio' })
  @MaxLength(50, {
    message: 'El número de factura no puede exceder los 50 caracteres',
  })
  number: string;

  @ApiProperty({
    description: 'Monto total de la factura',
    example: 3750.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El monto total debe ser un número' })
  @Min(0.01, { message: 'El monto total debe ser mayor a 0' })
  totalAmount: number;

  @ApiProperty({
    description: 'Estado de la factura',
    enum: StateInvoice,
    example: StateInvoice.PENDING,
    default: StateInvoice.PENDING,
    required: false,
  })
  @IsEnum(StateInvoice, {
    message: 'El estado debe ser PENDING, PAID o CANCELLED',
  })
  @IsOptional()
  status?: StateInvoice;

  @ApiProperty({
    description: 'ID de la empresa emisora de la factura',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio' })
  companyId: string;

  @ApiProperty({
    description: 'ID del cliente receptor de la factura',
    example: '987fcdeb-51a2-43d7-b789-123456789abc',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID del cliente debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  customerId: string;

  @ApiProperty({
    description: 'Detalles de los productos o servicios de la factura',
    type: [CreateInvoiceDetailDto],
    isArray: true,
  })
  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ValidateNested({
    each: true,
    message: 'Cada detalle debe tener el formato correcto',
  })
  @Type(() => CreateInvoiceDetailDto)
  @IsNotEmpty({ message: 'Debe incluir al menos un detalle de factura' })
  details: CreateInvoiceDetailDto[];
}
