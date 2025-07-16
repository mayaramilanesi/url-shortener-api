import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Erro interno do servidor',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo do erro HTTP',
    example: 'Bad Request',
  })
  error: string;
}
