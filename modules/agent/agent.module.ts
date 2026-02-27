import { Module } from '@nestjs/common';
import { AgentService } from './application/agent.service';
import type { LLMClientContract } from './application/contracts/llm-client.contract';
import { ToolRouter } from './infrastructure/tools/tool.router';
import { AgentController, LLM_CLIENT_TOKEN } from './agent.controller';

export class OpenAILLMClientStub implements LLMClientContract {
  async invoke(): Promise<string> {
    throw new Error('LLM not configured');
  }
}

@Module({
  controllers: [AgentController],
  providers: [
    AgentService,
    ToolRouter,
    {
      provide: LLM_CLIENT_TOKEN,
      useClass: OpenAILLMClientStub,
    },
  ],
})
export class AgentModule {}
