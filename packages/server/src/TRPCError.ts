import { TRPC_ERROR_CODE_KEY } from './rpc/codes';
import { getMessageFromUnkownError } from './internals/errors';

export class TRPCError extends Error {
  public readonly cause?: unknown;
  public readonly code;

  constructor(opts: {
    message?: string;
    code: TRPC_ERROR_CODE_KEY;
    cause?: unknown;
  }) {
    const cause = opts.cause;
    const code = opts.code;
    const message = opts.message ?? getMessageFromUnkownError(cause, code);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore https://github.com/tc39/proposal-error-cause
    super(message, { cause });

    this.code = code;
    this.cause = cause;
    this.name = 'TRPCError';

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
