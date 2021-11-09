interface IEmbracedResponse {
  // TODO: [REFACTOR] 'authToken' could be always paired with 'payload' prop or be contained by it
  authToken: string | null;
  payload: Record<string, unknown> | unknown[];
  message: string;
  error: string;
  exception: Error | { message: string; stack?: string };
}

export const embraceResponse = <Key extends keyof IEmbracedResponse>(response: Record<Key, IEmbracedResponse[Key]>) =>
  response;

export const normalizePayloadType = <Type>(payload: Type) => payload as Record<keyof Type, Type[keyof Type]>;
