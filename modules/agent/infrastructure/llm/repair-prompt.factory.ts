export function buildRepairPrompt(invalidOutput: string): string {
  return [
    'Retorne exatamente 1 objeto JSON válido no formato abaixo.',
    'Formato esperado:',
    '{',
    '  "tool": string | null,',
    '  "arguments": object (obrigatório se tool != null),',
    '  "response": string (obrigatório se tool == null)',
    '}',
    'Saída inválida anterior (entre delimitadores):',
    '---INVALID_OUTPUT_START---',
    invalidOutput,
    '---INVALID_OUTPUT_END---',
  ].join('\n');
}
