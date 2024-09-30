/**
 * Converts a synchronous task to a synchronous generator.
 *
 * @param task - The synchronous task to convert.
 * @returns The converted synchronous generator.
 * @typeParam R - The return type of the task.
 */
function $resultToGenerator<R>(
	resultOrPromiseResult: R,
): Generator<Extract<R, Error>, Exclude<R, Error>>;

/**
 * Converts a promise task to an asynchronous generator.
 *
 * @param task - The promise task to convert.
 * @returns The converted asynchronous generator.
 * @typeParam R - The return type of the task.
 */
function $resultToGenerator<R>(
	resultOrPromiseResult: Promise<R>,
): AsyncGenerator<Extract<R, Error>, Exclude<R, Error>>;

/**
 * Converts a task to a generator.
 *
 * @param task - The task to convert.
 * @returns The converted generator.
 * @typeParam R - The return type of the task.
 */
function $resultToGenerator<R>(
	resultOrPromiseResult: Promise<R> | R,
):
	| Generator<Extract<R, Error>, Exclude<R, Error>>
	| AsyncGenerator<Extract<R, Error>, Exclude<R, Error>> {
	if (resultOrPromiseResult instanceof Promise) {
		// Create an AsyncGenerator that returns the successful result or yields
		// the error.
		return (async function* () {
			const result = await resultOrPromiseResult;
			if (result instanceof Error) yield result as Extract<R, Error>;
			return result as Exclude<R, Error>;
		})();
	}

	// Create a generator that returns the successful result or yields the error.
	return (function* () {
		if (resultOrPromiseResult instanceof Error)
			yield resultOrPromiseResult as Extract<R, Error>;
		return resultOrPromiseResult as Exclude<R, Error>;
	})();
}

/**
 * Allows to compose tasks by mimicking the "try" operator in zig. A
 * synchronous generator function enable this composition by providing a "$try"
 * function that can be used to yield the result of a task. If the task returns
 * an error, the generator will stop the execution and return the error,
 * otherwise it will continue the execution with the result of the task.
 *
 * @param generator - The generator to execute.
 * @returns The result of the generator.
 * @typeParam T - The type of the successful result.
 * @typeParam E - The type of the error result.
 */
export function $macro<T, E>(
	$generator: ($try: typeof $resultToGenerator) => Generator<T, E>,
): T | E;

/**
 * Allows to compose tasks by mimicking the "try" operator in zig. An
 * asynchronous generator function enable this composition by providing a "$try"
 * function that can be used to yield the result of a task. If the task returns
 * an error, the generator will stop the execution and return the error,
 * otherwise it will continue the execution with the result of the task.
 *
 * @param generator - The generator to execute.
 * @returns The result of the generator.
 * @typeParam T - The type of the successful result.
 * @typeParam E - The type of the error result.
 */
export function $macro<T, E>(
	$generator: ($try: typeof $resultToGenerator) => AsyncGenerator<T, E>,
): Promise<T | E>;

/**
 * Allows to compose tasks by mimicking the "try" operator in zig. A generator
 * function enable this composition by providing a "$try" function that can be
 * used to yield the result of a task. If the task returns an error, the
 * generator will stop the execution and return the error, otherwise it will
 * continue the execution with the result of the task.
 *
 * @param generator - The generator to execute.
 * @returns The result of the generator.
 * @typeParam T - The type of the successful result.
 * @typeParam E - The type of the error result.
 */
export function $macro<T, E>(
	$generator: (
		$try: typeof $resultToGenerator,
	) => Generator<T, E> | AsyncGenerator<T, E>,
): T | E | Promise<T | E> {
	const value = $generator($resultToGenerator).next();
	if (value instanceof Promise) {
		return value.then((value) => value.value);
	}

	return value.value;
}
