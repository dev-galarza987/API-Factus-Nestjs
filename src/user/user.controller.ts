import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/types/UserRole';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ============================================================
  // CRUD ENDPOINTS
  // ============================================================

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener usuarios paginados' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de registros por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios paginados obtenidos exitosamente',
  })
  findPaginated(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.userService.findPaginated(page, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener usuarios activos' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios activos obtenidos exitosamente',
  })
  findActive() {
    return this.userService.findActive();
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    description: 'Rol del usuario (COMPANY o CUSTOMER)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios por rol obtenidos exitosamente',
  })
  findByRole(@Param('role') role: UserRole) {
    return this.userService.findByRole(role);
  }

  @Get('with-company')
  @ApiOperation({ summary: 'Obtener usuarios con empresa asociada' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios con empresa obtenidos exitosamente',
  })
  findWithCompany() {
    return this.userService.findWithCompany();
  }

  @Get('with-customer')
  @ApiOperation({ summary: 'Obtener usuarios con cliente asociado' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios con cliente obtenidos exitosamente',
  })
  findWithCustomer() {
    return this.userService.findWithCustomer();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtener los últimos usuarios registrados' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de usuarios a obtener',
  })
  @ApiResponse({
    status: 200,
    description: 'Últimos usuarios obtenidos exitosamente',
  })
  getLatestUsers(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.userService.getLatestUsers(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está en uso',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  // ============================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================

  @Post('auth/login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales inválidas o usuario desactivado',
  })
  login(@Body() loginDto: { email: string; password: string }) {
    return this.userService.login(loginDto.email, loginDto.password);
  }

  // ============================================================
  // VALIDATION ENDPOINTS
  // ============================================================

  @Get('email/:email/exists')
  @ApiOperation({ summary: 'Verificar si un email ya existe' })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email a verificar',
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación realizada exitosamente',
  })
  existsByEmail(@Param('email') email: string) {
    return this.userService.existsByEmail(email);
  }

  @Get(':id/is-active')
  @ApiOperation({ summary: 'Verificar si un usuario está activo' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación realizada exitosamente',
  })
  isActiveUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.isActiveUser(id);
  }

  // ============================================================
  // STATISTICS ENDPOINTS
  // ============================================================

  @Get('stats/total')
  @ApiOperation({ summary: 'Contar el total de usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Total de usuarios obtenido exitosamente',
  })
  countTotal() {
    return this.userService.countTotal();
  }

  @Get('stats/active')
  @ApiOperation({ summary: 'Contar usuarios activos' })
  @ApiResponse({
    status: 200,
    description: 'Total de usuarios activos obtenido exitosamente',
  })
  countActive() {
    return this.userService.countActive();
  }

  @Get('stats/role/:role')
  @ApiOperation({ summary: 'Contar usuarios por rol' })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    description: 'Rol del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de usuarios por rol obtenido exitosamente',
  })
  countByRole(@Param('role') role: UserRole) {
    return this.userService.countByRole(role);
  }

  @Get('stats/general')
  @ApiOperation({ summary: 'Obtener estadísticas generales de usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getGeneralStats() {
    return this.userService.getGeneralStats();
  }
}
