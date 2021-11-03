interface IEmbracedResponse {
  // TODO: [TS] 'token' could be restricted to only be paired with 'payload' prop
  token: string;
  payload: Record<string, unknown> | unknown[];
  message: string;
  error: string;
  exception: Error | { message: string; stack?: string };
}

export const embraceResponse = <Key extends keyof IEmbracedResponse>(response: Record<Key, IEmbracedResponse[Key]>) =>
  response;

export const normalizePayloadType = <Type>(payload: Type) => payload as Record<keyof Type, Type[keyof Type]>;
