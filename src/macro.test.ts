import { describe, expect, test } from "bun:test";
import { $macro } from "./macro.js";

describe("$macro behavior with synchronous generators", () => {
	test("Generator that returns a value", () => {
		const toReturn = "value";
		// biome-ignore lint/correctness/useYield:
		const result = $macro(function* () {
			return toReturn;
		});

		expect(result).toBe(toReturn);
	});

	test("Generator that returns an error", () => {
		const toReturn = new Error();
		// biome-ignore lint/correctness/useYield:
		const result = $macro(function* () {
			return toReturn;
		});

		expect(result).toBe(toReturn);
	});

	test("Generator that throws", () => {
		const toThrow = "error";
		expect(() =>
			// biome-ignore lint/correctness/useYield:
			$macro(function* () {
				throw toThrow;
			}),
		).toThrow(toThrow);
	});

	test("Generator that yields a value", () => {
		const toReturn = "value";
		const result = $macro(function* ($try) {
			return yield* $try(toReturn);
		});

		expect(result).toBe(toReturn);
	});

	test("Generator that yields an error", () => {
		const toReturn = new Error();
		const result = $macro(function* ($try) {
			yield* $try(toReturn);
			return "value";
		});

		expect(result).toBe(toReturn);
	});
});

describe("$macro behavior with asynchronous generators", () => {
	test("Generator that returns a value", async () => {
		const toReturn = "value";
		// biome-ignore lint/correctness/useYield:
		const resultPromise = $macro(async function* () {
			return toReturn;
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that returns an error", async () => {
		const toReturn = new Error();
		// biome-ignore lint/correctness/useYield: <explanation>
		const resultPromise = $macro(async function* () {
			return toReturn;
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that throws", async () => {
		const toThrow = "error";
		// biome-ignore lint/correctness/useYield: <explanation>
		const resultPromise = $macro(async function* () {
			throw toThrow;
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		await expect(resultPromise).rejects.toBe(toThrow);
	});

	test("Generator that yields a value", async () => {
		const toReturn = "value";
		const resultPromise = $macro(async function* ($try) {
			return yield* $try(toReturn);
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that yields an error", async () => {
		const toReturn = new Error();
		const resultPromise = $macro(async function* ($try) {
			yield* $try(toReturn);
			return "value";
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that yields a promise that resolves to a value", async () => {
		const toReturn = "value";
		const resultPromise = $macro(async function* ($try) {
			return yield* $try(Promise.resolve(toReturn));
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that yields a promise that resolves to an error", async () => {
		const toReturn = new Error();
		const resultPromise = $macro(async function* ($try) {
			return yield* $try(Promise.resolve(toReturn));
		});

		expect(resultPromise).toBeInstanceOf(Promise);

		const result = await resultPromise;
		expect(result).toBe(toReturn);
	});

	test("Generator that yields a promise that rejects", async () => {
		const toThrow = new Error();
		expect(() =>
			$macro(async function* ($try) {
				return yield* $try(Promise.reject(toThrow));
			}),
		).toThrow(toThrow);
	});
});
