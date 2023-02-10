export const possiblyReEncodeURI = (uri: string, shouldLogReEncoding = false) => {
  const decodedUri = globalThis.decodeURIComponent(uri);
  const encodedUri = globalThis.encodeURIComponent(uri);

  // re-encode `uri` if it's not either fully encoded or decoded
  if (uri !== decodedUri || uri !== encodedUri) {
    const reEncodedURI = globalThis.encodeURIComponent(decodedUri);

    if (shouldLogReEncoding) {
      console.log('Done percentage encoding for:\n\t- uri:', uri, '\n\t- reEncodedURI:', reEncodedURI);
    }

    return reEncodedURI;
  }

  return uri;
};
