import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Tech Solutions S.A.',
    maxLength: 255,
    required: false,
  })
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(255, {
    message: 'La razón social no puede exceder los 255 caracteres',
  })
  businessName?: string;

  @ApiProperty({
    description: 'Número de identificación fiscal (RUC/NIT)',
    example: '20123456789',
    maxLength: 50,
    required: false,
  })
  @IsString({
    message: 'El número de identificación fiscal debe ser una cadena de texto',
  })
  @IsOptional()
  @MaxLength(50, {
    message:
      'El número de identificación fiscal no puede exceder los 50 caracteres',
  })
  taxId?: string;

  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'contact@techsolutions.com',
    maxLength: 100,
    required: false,
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El correo electrónico no puede exceder los 100 caracteres',
  })
  email?: string;

  @ApiProperty({
    description: 'Dirección física de la empresa',
    example: 'Av. Principal 123, Lima, Perú',
    maxLength: 500,
    required: false,
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(500, {
    message: 'La dirección no puede exceder los 500 caracteres',
  })
  address?: string;
}
