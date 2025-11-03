import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nombre completo o razón social del cliente',
    example: 'Juan Pérez González',
    maxLength: 255,
  })
  @IsString({
    message: 'El nombre del cliente debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  @MaxLength(255, {
    message: 'El nombre del cliente no puede exceder los 255 caracteres',
  })
  name!: string;

  @ApiProperty({
    description: 'Número de identificación fiscal o documento de identidad',
    example: '12345678901',
    maxLength: 50,
  })
  @IsString({
    message: 'El número de identificación debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El número de identificación es obligatorio',
  })
  @MaxLength(50, {
    message: 'El número de identificación no puede exceder los 50 caracteres',
  })
  taxOrId!: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@email.com',
    maxLength: 100,
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @MaxLength(100, {
    message: 'El correo electrónico no puede exceder los 100 caracteres',
  })
  email!: string;
}
