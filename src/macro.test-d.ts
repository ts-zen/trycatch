import { describe, test } from "bun:test";
import { expectType } from "tsd";
import { $macro } from "./macro.js";

describe("$macro typings with synchronous generators", () => {
	test("Generator that returns a value", () => {
		// biome-ignore lint/correctness/useYield: <explanation>
		const result = $macro(function* () {
			return "value";
		});

		expectType<string>(result);
	});

	test("Generator that returns an error", () => {
		// biome-ignore lint/correctness/useYield: <explanation>
		const result = $macro(function* () {
			return new Error();
		});

		expectType<Error>(result);
	});

	test("Generator that yields a value", () => {
		const result = $macro(function* ($try) {
			return yield* $try("value");
		});

		expectType<string>(result);
	});

	test("Generator that yields an error", () => {
		const result = $macro(function* ($try) {
			yield* $try(new Error());
			return "value";
		});

		expectType<string | Error>(result);
	});
});

describe("$macro typings with asynchronous generators", () => {
	test("Generator that returns a value", async () => {
		// biome-ignore lint/correctness/useYield: <explanation>
		const result = $macro(async function* () {
			return "value";
		});

		expectType<Promise<string>>(result);
	});

	test("Generator that returns an error", async () => {
		// biome-ignore lint/correctness/useYield: <explanation>
		const result = $macro(async function* () {
			return new Error();
		});

		expectType<Promise<Error>>(result);
	});

	test("Generator that yields a value", async () => {
		const result = $macro(async function* ($try) {
			return yield* $try("value");
		});

		expectType<Promise<string>>(result);
	});

	test("Generator that yields an error", async () => {
		const result = $macro(async function* ($try) {
			yield* $try(new Error());
			return "value";
		});

		expectType<Promise<string | Error>>(result);
	});
});
