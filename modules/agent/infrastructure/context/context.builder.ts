import type { ToolDefinition } from '../../application/contracts/tool-definition';

export function buildContext(params: {
  userMessage: string;
  tools: Readonly<Record<string, ToolDefinition>>;
}): {
  system: string;
  user: string;
  metadata: { toolNames: string[] };
} {
  const { userMessage, tools } = params;
  const toolNames = Object.keys(tools);

  const toolSummary = toolNames
    .map((toolName) => {
      const tool = tools[toolName];
      return `- ${tool.name}: ${tool.description}`;
    })
    .join('\n');

  const system = [
    'Retorne exatamente 1 objeto JSON válido no contrato do envelope.',
    'Use uma única tool quando necessário, ou resposta natural quando tool for null.',
    'Tools disponíveis (nome + quando usar):',
    toolSummary,
  ].join('\n');

  return {
    system,
    user: userMessage,
    metadata: {
      toolNames,
    },
  };
}
