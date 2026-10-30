/** Bound both fetch and body reads, even if a transport ignores cancellation. */
export async function withDeadline<T>(
  task: (signal: AbortSignal) => PromiseLike<T>,
  milliseconds: number,
  controller = new AbortController()
): Promise<T> {
  controller.signal.throwIfAborted();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let aborted: (() => void) | undefined;
  const cancellation = new Promise<never>((_, reject) => {
    aborted = () => reject(controller.signal.reason ?? new DOMException("Aborted", "AbortError"));
    if (controller.signal.aborted) aborted();
    else controller.signal.addEventListener("abort", aborted, { once: true });
    timer = setTimeout(
      () => controller.abort(new DOMException("Timed out", "TimeoutError")),
      milliseconds
    );
  });
  try {
    return await Promise.race([Promise.resolve(task(controller.signal)), cancellation]);
  } finally {
    clearTimeout(timer);
    if (aborted) controller.signal.removeEventListener("abort", aborted);
  }
}
