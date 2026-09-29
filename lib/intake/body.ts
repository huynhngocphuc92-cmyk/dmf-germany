export class InvalidBody extends Error {
  constructor(public status: 400 | 413) {
    super("Invalid request body");
  }
}

export async function readJsonBody(request: Request, maxBytes = 32768): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new InvalidBody(413);
  const reader = request.body?.getReader();
  if (!reader) throw new InvalidBody(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new InvalidBody(413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof InvalidBody) throw error;
    throw new InvalidBody(400);
  } finally {
    reader.releaseLock();
  }
}
