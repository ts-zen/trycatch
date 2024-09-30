import { describe, test } from "bun:test";
import { expectType } from "tsd";
import { $trycatch, type ThrownError } from "./trycatch.js";

describe("$trycatch typings with synchronous tasks", () => {
	test("Task that returns a value", () => {
		const [value, err] = $trycatch(() => "value");

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<string>(value);
		}
	});

	test("Task that returns an Error", () => {
		const [value, err] = $trycatch(() => new Error());

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<Error>(value);
		}
	});

	test("Task that returns 'unknown'", () => {
		const [value, err] = $trycatch(() => "value" as unknown);

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<unknown>(value);
		}
	});

	test("Task that returns 'never'", () => {
		const [value, err] = $trycatch(() => "value" as never);

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});

	test("Task that throws", () => {
		const [value, err] = $trycatch(() => {
			throw new Error();
		});

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});
});

describe("$trycatch typings with asynchronous tasks", () => {
	test("Task that returns a value", async () => {
		const [value, err] = await $trycatch(async () => "value");

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<string>(value);
		}
	});

	test("Task that returns an Error", async () => {
		const [value, err] = await $trycatch(async () => new Error());

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<Error>(value);
		}
	});

	test("Task that returns 'unknown'", async () => {
		const [value, err] = await $trycatch(async () => "value" as unknown);

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<unknown>(value);
		}
	});

	test("Task that returns 'never'", async () => {
		const [value, err] = await $trycatch(async () => "value" as never);

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});

	test("Task that throws", async () => {
		const [value, err] = await $trycatch(async () => {
			throw new Error();
		});

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});
});

describe("$trycatch typings with Promise tasks", () => {
	test("Task that returns a value", async () => {
		const [value, err] = await $trycatch(Promise.resolve("value"));

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<string>(value);
		}
	});

	test("Task that returns an Error", async () => {
		const [value, err] = await $trycatch(Promise.resolve(new Error()));

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<Error>(value);
		}
	});

	test("Task that returns 'unknown'", async () => {
		const [value, err] = await $trycatch(Promise.resolve("value" as unknown));

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<unknown>(value);
		}
	});

	test("Task that returns 'never'", async () => {
		const [value, err] = await $trycatch(Promise.resolve("value" as never));

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});

	test("Task that rejects", async () => {
		const [value, err] = await $trycatch(Promise.reject(new Error()));

		expectType<unknown>(value);
		expectType<ThrownError | null>(err);

		if (err === null) {
			expectType<never>(value);
		}
	});
});
