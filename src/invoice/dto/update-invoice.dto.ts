import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsUUID,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { StateInvoice } from 'src/types/StateInvoice';

export class UpdateInvoiceDto {
  @ApiProperty({
    description: 'Número de factura único',
    example: 'FAC-2025-0001',
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'El número de factura debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(50, {
    message: 'El número de factura no puede exceder los 50 caracteres',
  })
  number?: string;

  @ApiProperty({
    description: 'Monto total de la factura',
    example: 3750.0,
    minimum: 0.01,
    required: false,
  })
  @IsNumber({}, { message: 'El monto total debe ser un número' })
  @Min(0.01, { message: 'El monto total debe ser mayor a 0' })
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({
    description: 'Estado de la factura',
    enum: StateInvoice,
    example: StateInvoice.PAID,
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
    required: false,
  })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  @IsOptional()
  companyId?: string;

  @ApiProperty({
    description: 'ID del cliente receptor de la factura',
    example: '987fcdeb-51a2-43d7-b789-123456789abc',
    format: 'uuid',
    required: false,
  })
  @IsUUID('4', { message: 'El ID del cliente debe ser un UUID válido' })
  @IsOptional()
  customerId?: string;
}
