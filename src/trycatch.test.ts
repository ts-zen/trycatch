import { describe, expect, test } from "bun:test";
import { $trycatch } from "./trycatch.js";

describe("$trycatch behavior with synchronous tasks", () => {
	test("Task that returns a value", () => {
		const toReturn = "value";
		const [value, error] = $trycatch(() => toReturn);

		expect(value).toBe(toReturn);
		expect(error).toBe(null);
	});

	test("Task that throws an Error object", () => {
		const toThrow = new Error("Error");
		const [value, error] = $trycatch(() => {
			throw toThrow;
		});

		expect(value).toBe(null);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that throws a non Error object", () => {
		const toThrow = "error";
		const [value, error] = $trycatch(() => {
			throw toThrow;
		});

		expect(value).toBe(null);
		expect(error).toBeInstanceOf(Error);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that returns an Error object", () => {
		const toReturn = new Error("Error");
		const [value, error] = $trycatch(() => {
			return toReturn;
		});

		expect(value).toBe(toReturn);
		expect(error).toBe(null);
	});
});

describe("$trycatch behavior with asynchronous tasks", () => {
	test("Task that returns a value", async () => {
		const toReturn = "value";
		const outcomePromise = $trycatch(async () => toReturn);
		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe("value");
		expect(error).toBe(null);
	});

	test("Task that throws an Error object", async () => {
		const toThrow = new Error("Error");
		const outcomePromise = $trycatch(async () => {
			throw toThrow;
		});

		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(null);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that throws a non Error object", async () => {
		const toThrow = "error";
		const outcomePromise = $trycatch(async () => {
			throw toThrow;
		});

		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(null);
		expect(error).toBeInstanceOf(Error);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that returns an Error object", async () => {
		const toReturn = new Error("Error");
		const outcomePromise = $trycatch(async () => {
			return toReturn;
		});

		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(toReturn);
		expect(error).toBe(null);
	});
});

describe("$trycatch behavior with Promise tasks", () => {
	test("Task that returns a value", async () => {
		const toResolve = "value";
		const outcomePromise = $trycatch(
			new Promise((resolve) => void resolve(toResolve)),
		);
		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(toResolve);
		expect(error).toBe(null);
	});

	test("Task that throws an Error object", async () => {
		const toThrow = new Error("Error");
		const outcomePromise = $trycatch(
			new Promise((_, reject) => void reject(toThrow)),
		);
		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(null);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that throws a non Error object", async () => {
		const toThrow = "error";
		const outcomePromise = $trycatch(
			new Promise((_, reject) => void reject(toThrow)),
		);
		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(null);
		expect(error).toBeInstanceOf(Error);
		expect(error?.cause).toBe(toThrow);
	});

	test("Task that returns an Error object", async () => {
		const toResolve = new Error("Error");
		const outcomePromise = $trycatch(
			new Promise<typeof toResolve>((resolve) => void resolve(toResolve)),
		);
		expect(outcomePromise).toBeInstanceOf(Promise);

		const [value, error] = await outcomePromise;
		expect(value).toBe(toResolve);
		expect(error).toBe(null);
	});
});
