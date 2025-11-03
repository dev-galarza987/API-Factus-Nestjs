import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateInvoiceDetailDto {
  @ApiProperty({
    description: 'Descripción del producto o servicio',
    example: 'Laptop HP Pavilion 15 - Intel Core i7, 16GB RAM, 512GB SSD',
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
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto o servicio',
    example: 1500.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @Min(0.01, { message: 'El precio unitario debe ser mayor a 0' })
  unitPrice: number;

  @ApiProperty({
    description: 'Subtotal de la línea (cantidad × precio unitario)',
    example: 3750.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @IsNotEmpty({ message: 'El subtotal es obligatorio' })
  @Min(0.01, { message: 'El subtotal debe ser mayor a 0' })
  subtotal: number;

  @ApiProperty({
    description: 'ID de la factura a la que pertenece este detalle',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID de la factura debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la factura es obligatorio' })
  invoiceId: string;
}
