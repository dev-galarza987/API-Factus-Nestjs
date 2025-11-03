import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from 'src/types/PaymentMethod';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Método de pago utilizado',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
    enumName: 'PaymentMethod',
  })
  @IsEnum(PaymentMethod, {
    message:
      'El método de pago debe ser CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, CHECK o DIGITAL_WALLET',
  })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  method: PaymentMethod;

  @ApiProperty({
    description: 'Monto del pago realizado',
    example: 1500.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'El monto del pago debe ser un número' })
  @IsNotEmpty({ message: 'El monto del pago es obligatorio' })
  @Min(0.01, { message: 'El monto del pago debe ser mayor a 0' })
  amount: number;

  @ApiProperty({
    description: 'ID de la factura a la que se aplica este pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'El ID de la factura debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la factura es obligatorio' })
  invoiceId: string;
}
