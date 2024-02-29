import { Observable } from 'rxjs';

export type Result<TMessage extends string = string, TPayload = undefined> = {
  message: TMessage;
  payload: TPayload;
};

export type ObservableResult<
  TMessage extends string = string,
  TPayload = undefined,
> = Observable<Result<TMessage, TPayload>>;

export type ObservableAsyncResult<
  TMessage extends string = string,
  TPayload = undefined,
> = Promise<ObservableResult<TMessage, TPayload>>;

export const result = <TMessage extends string = string, TPayload = undefined>(
  message: TMessage,
  payload: TPayload,
) => ({
  message,
  payload,
});
