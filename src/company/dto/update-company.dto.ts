import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Tech Solutions S.A.',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessName?: string;

  @ApiProperty({
    description: 'Número de identificación fiscal (RUC/NIT)',
    example: '20123456789',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxId?: string;

  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'contact@techsolutions.com',
    maxLength: 100,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: 'Dirección física de la empresa',
    example: 'Av. Principal 123, Lima, Perú',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;
}
