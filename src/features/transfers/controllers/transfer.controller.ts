import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransferService } from '../providers/transfer.service';
import { CreateTransferDto } from '../dtos/create-transfer.dto';
import { UpdateTransferDto } from '../dtos/update-transfer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Transfer } from '../entities/transfer.entity';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';
import { User } from 'src/features/users/entities/user.entity';
import { PermissionsGuard } from 'src/features/auth/guards/permissions.guard';
import { Permissions } from 'src/features/auth/decorators/permissions.decorator';
import { PermissionEnum } from 'src/features/auth/enums/permission.enum';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard, RolesGuard)
@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @Permissions(PermissionEnum.CREATE_TRANSFER)
  @ApiOperation({ summary: 'Create a new transfer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The transfer has been successfully created.',
    type: Transfer,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data or related entity not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. User does not have access to the specified project or organizational unit.',
  })
  create(
    @Body() createTransferDto: CreateTransferDto,
    @Req() req: { user: User },
  ): Promise<Transfer> {
    return this.transferService.createTransfer(createTransferDto, req.user);
  }

  @Get()
  @Permissions(PermissionEnum.VIEW_TRANSFERS)
  @ApiOperation({ summary: 'Get all transfers accessible by the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of accessible transfers.',
    type: [Transfer],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. Token not provided or invalid.',
  })
  findAll(@Req() req: { user: User }): Promise<Transfer[]> {
    return this.transferService.findAllForUser(req.user);
  }

  @Get(':id')
  @Permissions(PermissionEnum.VIEW_TRANSFERS)
  @ApiOperation({ summary: 'Get a specific transfer by ID' })
  @ApiParam({ name: 'id', description: 'Transfer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The transfer details.',
    type: Transfer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transfer not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. User does not have access to this transfer.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ): Promise<Transfer> {
    return this.transferService.findOneByIdAndUser(id, req.user);
  }

  @Patch(':id')
  @Permissions(PermissionEnum.EDIT_TRANSFER)
  @ApiOperation({ summary: 'Update an existing transfer' })
  @ApiParam({ name: 'id', description: 'Transfer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The transfer has been successfully updated.',
    type: Transfer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transfer not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. Invalid input data or related entity not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. User does not have access to the target project or organizational unit.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransferDto: UpdateTransferDto,
    @Req() req: { user: User },
  ): Promise<Transfer> {
    return this.transferService.updateTransfer(id, updateTransferDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PermissionEnum.DELETE_TRANSFER)
  @ApiOperation({ summary: 'Delete a transfer' })
  @ApiParam({ name: 'id', description: 'Transfer ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The transfer has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transfer not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. User does not have permission to delete this transfer.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ): Promise<void> {
    return this.transferService.deleteTransfer(id, req.user);
  }
}
