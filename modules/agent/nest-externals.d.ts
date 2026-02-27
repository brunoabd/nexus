declare module '@nestjs/common' {
  export class BadRequestException extends Error {
    constructor(message?: string);
  }
  export function Body(): ParameterDecorator;
  export function Controller(path?: string): ClassDecorator;
  export function Inject(token: string): ParameterDecorator;
  export function Module(metadata: {
    controllers?: unknown[];
    providers?: unknown[];
    imports?: unknown[];
    exports?: unknown[];
  }): ClassDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Req(): ParameterDecorator;
  export function UseGuards(...guards: unknown[]): ClassDecorator & MethodDecorator;
}

declare module '@nestjs/passport' {
  export function AuthGuard(strategy: string): unknown;
}

declare module 'class-validator' {
  export function IsNotEmpty(): PropertyDecorator;
  export function IsString(): PropertyDecorator;
  export function validateSync(input: unknown): unknown[];
}
