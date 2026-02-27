import { BadRequestException, Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { AgentService } from './application/agent.service';
import type { LLMClientContract } from './application/contracts/llm-client.contract';

export const LLM_CLIENT_TOKEN = 'LLMClientContract';

class AgentChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    @Inject(LLM_CLIENT_TOKEN) private readonly llmClient: LLMClientContract,
  ) {}

  @Post('chat')
  async chat(@Req() req: { user?: { id?: string } }, @Body() body: { message?: string }): Promise<unknown> {
    const dto = new AgentChatDto();
    dto.message = body?.message ?? '';
    const errors = validateSync(dto);

    if (errors.length > 0) {
      throw new BadRequestException('message is required');
    }

    const userId = req?.user?.id;
    if (!userId) {
      throw new BadRequestException('user id is required');
    }

    return this.agentService.handleMessage({
      userId,
      message: dto.message,
      llmClient: this.llmClient,
    });
  }
}
