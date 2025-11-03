import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Tech Solutions S.A.',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  businessName!: string;

  @ApiProperty({
    description: 'Número de identificación fiscal (RUC/NIT)',
    example: '20123456789',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxId!: string;

  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'contact@techsolutions.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email!: string;

  @ApiProperty({
    description: 'Dirección física de la empresa',
    example: 'Av. Principal 123, Lima, Perú',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address!: string;
}
