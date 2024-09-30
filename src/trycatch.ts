/**
 * Represent the successful case of a {@link TryCatch} tuple.
 *
 * @typeParam R - The type of the result.
 */
type Ok<R> = [result: R, err: null];

/**
 * Represent the error case of a {@link TryCatch} tuple.
 */
type Err = [result: unknown, err: ThrownError];

/**
 * TryCatch represents the return value of the {@link $trycatch} utility. It is
 * composed of a tuple where the first element is the resulting value and the
 * second element is the caught error. The result element will be typed as
 * "unknown" until the absence of an error is asserted in the control flow,
 * Type narrowing will then unveil the actual type of the result. This ensures
 * that the presence of a value is always tied to the absence of an error, and
 * vice versa. The caught error is always encapsulated in an {@link ThrownError}
 * object and is available in the "cause" property.
 *
 * @typeParam R - The return type of the task.
 */
type TryCatch<R> = Ok<R> | Err;

/**
 * Wraps a synchronous task in a try-catch block and returns the resulting
 * {@link TryCatch} tuple.
 *
 * @param task - A synchronous task.
 * @returns The resulting {@link TryCatch} tuple.
 */
// TODO: This is here just for the sake of having a completely typed API, useful
// when some is prototyping or testing this library type system and pass a
// function that alway throw and never return. If someone knows how to integrate
// this into the main overload we can remove it. The main reason to remove it
// shows up as an overload when hovering the function in an IDE.
export function $trycatch(task: () => never): TryCatch<never>;

/**
 * Wraps an asynchronous task in a try-catch block and returns a promise that
 * resolves with the resulting {@link TryCatch} tuple.
 *
 * @param task - An asynchronous task.
 * @returns The promise that resolves with the resulting {@link TryCatch} tuple.
 * @typeParam R - The return type of the task.
 */
export function $trycatch<R>(task: () => Promise<R>): Promise<TryCatch<R>>;

/**
 * Wraps a synchronous functional task in a try-catch block and returns its
 * {@link TryCatch}.
 *
 * @param task - A synchronous functional task.
 * @returns The task {@link TryCatch}.
 * @typeParam R - The return type of the task.
 */
export function $trycatch<R>(task: () => R): TryCatch<R>;

/**
 * Chains a promise task with then/catch and return a promise that resolves
 * with the resulting {@link TryCatch} tuple.
 *
 * @param task - A promise task.
 * @returns The promise that resolves with the resulting {@link TryCatch} tuple.
 * @typeParam R - The return type of the task.
 */
export function $trycatch<R>(task: Promise<R>): Promise<TryCatch<R>>;

/**
 * Wraps a task in a try-catch block, or chains a promise task with then/catch,
 * and returns the resulting {@link TryCatch} tuple.
 *
 * @param task - A task to wrap in a try-catch block.
 * @returns The resulting {@link TryCatch} tuple or a promise that resolves with
 * the resulting {@link TryCatch} tuple.
 * @typeParam R - The return type of the task.
 */
export function $trycatch<R>(
	task: (() => R) | Promise<R> | (() => Promise<R>),
): Promise<TryCatch<R>> | TryCatch<R> {
	if (task instanceof Promise) {
		// Generate a promise that resolves to the TryCatch tuple.
		return task.then(ok).catch(err);
	}

	try {
		// Execute the task and get its result.
		const maybePromiseResult = task();
		if (maybePromiseResult instanceof Promise) {
			// Generate a promise that resolves to the result of the task.
			return maybePromiseResult.then(ok).catch(err);
		}

		return ok(maybePromiseResult);
	} catch (thrown) {
		return err(thrown);
	}
}

/**
 * Create an {@link Ok} tuple with the given result.
 *
 * @param result - The result to wrap.
 * @returns An {@link Ok} tuple.
 * @typeParam R - The type of the result.
 */
const ok = <R>(result: R): Ok<R> => [result, null];

/**
 * Create an {@link Err} tuple with the given thrown value.
 *
 * @param thrown - The thrown value to wrap.
 * @returns An {@link Err} tuple.
 */
const err = (thrown: unknown): Err => [null, new ThrownError(thrown)];

/**
 * Encapsulates a thrown value in an error object.
 */
export class ThrownError extends Error {
	/**
	 * Creates a new error with the given cause.
	 *
	 * @param cause - The cause of the error.
	 */
	public constructor(cause: unknown) {
		super("thrown error", { cause });
		// Manually set the cause as a property for backward compatibility.
		this.cause = cause;
		// Capture the stack trace.
		if (Error.captureStackTrace) Error.captureStackTrace(this, ThrownError);
	}
}
