import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Nombre completo o razón social del cliente',
    example: 'Juan Pérez González',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Número de identificación fiscal o documento de identidad',
    example: '12345678901',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxOrId?: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@email.com',
    maxLength: 100,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;
}
