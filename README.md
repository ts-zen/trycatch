<div align="center">
  
<br>

<img src="https://raw.githubusercontent.com/ts-zen/trycatch/refs/heads/main/docs/statics/logo.svg" width="40%" /> <br>

**Robust** and **Type-Safe** Errors Management **Conventions** with [`Typescript`](https://www.typescriptlang.org/)

[![types: Typescript](https://img.shields.io/badge/types-Typescript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Github CI](https://img.shields.io/github/actions/workflow/status/ts-zen/trycatch/ci.yml?style=flat-square&branch=main)](https://github.com/ts-zen/trycatch/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/ts-zen/trycatch?color=44cc11&logo=codecov&style=flat-square)](https://codecov.io/gh/ts-zen/trycatch)
[![code style: Prettier](https://img.shields.io/badge/code_style-Prettier-ff69b4.svg?style=flat-square&logo=prettier)](https://prettier.io/)
[![npm](https://img.shields.io/npm/v/@tszen/trycatch.svg?style=flat-square)](http://npm.im/@tszen/trycatch)
[![Bundle Size](https://img.shields.io/bundlejs/size/@tszen/trycatch?style=flat-square&label=size&logo=esbuild&color=FFCF00)](https://bundlejs.com/?q=@tszen/trycatch)

<h1></h1>

<img src="https://raw.githubusercontent.com/ts-zen/trycatch/refs/heads/main/docs/statics/example-dark.png#gh-dark-mode-only" width="80%" /> <br>
<img src="https://raw.githubusercontent.com/ts-zen/trycatch/refs/heads/main/docs/statics/example-light.png#gh-light-mode-only" width="80%" /> <br>

</div>

# Philosophy

> Haven’t read the blog post yet? You can find it [here](https://dev.to/paolimi/typescript-a-new-frontier-for-error-management-4li7) for a deep dive into the design and reasoning behind this project. Here's a quick snapshot to get you started:

JavaScript’s **error management** falls short of the expressive power and developer experience offered by modern languages like Rust, Zig, and Go. Language design is hard, and most proposals to the ECMAScript or TypeScript committees are either rejected or move through an extremely slow iteration process.

Most libraries and user-land solutions in this area introduce abstractions that fall into the red/blue function problem, requiring full codebase adoption and resulting in technology lock-in.

The goal of this project is to push the boundaries of error handling in JavaScript, prioritizing **conventions over abstractions** and leveraging native constructs to their fullest potential. We provide a minimal set of utilities to enhance developer experience, with the hope of inspiring future language improvements and the adoption of these conventions as first-class citizens in JavaScript.

# Table Of Contents

- [Philosophy](#philosophy)
- [Goals](#goals)
- [Convention](#convention)
- [Limitations](#limitations)
- [API and Usage](#api-and-usage)
  - [`$trycatch`](#utility-trycatch)
  - [`$macro`](#utility-macro`)

# Goals

This project aims to enhance JavaScript's try/catch model for error handling by drawing inspiration from modern languages like Rust, Zig, and Go. The focus is on:

- **Explicit error management**: Developers must explicitly handle or propagate errors, making their choice clear in the code.
- **Contiguous Control Flow**: Maintain a clean control flow without introducing new scopes as with traditional catch blocks.
- **Strongly typed Errors**: Enable typed errors that can be consumed or propagated from the callee to the caller.

As you'll see, this library is incredibly minimal _(340B Gzipped)_. The true value of this project lies in the conventions around it, whose design philosophy is to **not require any third-party libraries**. This library is built solely to enhance the use of those conventions and potentially inspire new standards in the language to fully embrace them. As **language design** requires careful consideration, we've followed core principles to ensure everything aligns with this broader vision:

- **Conventions over Abstractions**: Minimize abstractions by leveraging existing language features to their fullest.
- **Minimal API**: Strive for simplicity without sacrificing functionality. Conciseness is often an indicator of robust and lasting design.
- **Progressive Enhancement**: Our solution shouldn't depend on universal adoption, and must seamlessly consume and be consumed by code not written with the same principles in mind.
- **Intuitive and Ergonomic**: The patterns should be self-explanatory, allowing developers to grasp and implement them at a glance, minimizing the risk of misinterpretations that could result in anti-patterns or unexpected behaviors.
- **Exploit TypeScript**: Since TypeScript is a de facto standard, we leverage its type system to provide immediate feedback through IDE features like syntax highlighting, error detection, and auto-completion.

# Convention

The core of the convention relies on the concept of task. A task is any function that can either **succeed** or **fail**.

```typescript
function task() {
  if (condition) {
    throw new Error("failed");
  }

  return "value";
}
```

We distinguish between **expected** errors and unexpected errors — those we can anticipate, handle, and recover from — and **unexpected** errors, which we can't easily predict or recover from. Unexpected errors are indicated with the `throw` keyword, while expected errors are returned using the `return` keyword.

```typescript
function task() {
  if (condition) {
    // return instead of throwing.
    return new Error("failed");
  }

  return "value";
}
```

Expected errors are included in the return value of the task. TypeScript's language server provides strong guidance when consuming these return values, which we now refer to as results.

```typescript
const result: string | Error = task();

// Handle the error.
if (result instanceof Error) {
  return;
}

result;
// ?^ result: string
```

Managing multiple errors becomes reliable with TypeScript’s type checker, which guides the process through autocompletion and catches mistakes at compile time.

```typescript
function task() {
  if (condition1) return new CustomError1();
  if (condition2) return new CustomError2();
  return "value";
}
```

```typescript
// In another file...
const result = task();

if (result instanceof CustomError1) {
  // Handle CustomError1.
} else if (result instanceof CustomError2) {
  // Handle CustomError2.
}
```

Since this approach works with plain JavaScript, you can seamlessly integrate existing libraries like _[ts-pattern](https://github.com/gvergnaud/ts-pattern)_ for more advanced pattern matching.

```typescript
import { match } from "ts-pattern";
```

```typescript
match(result)
  .with(P.instanceOf(CustomError1), () => {
    /* Handle CustomError1 */
  })
  .with(P.instanceOf(CustomError2), () => {
    /* Handle CustomError2 */
  })
  .otherwise(() => {
    /* Handle success case */
  });
```

You can progressively enhance your codebase by wrapping third-party methods in tasks.

```typescript
async function $fetch(input: string, init?: RequestInit) {
  try {
    // Make the request.
    const response = await fetch(input, init);
    // Return the response if it's OK, otherwise an error.
    return response.ok ? response : new ResponseError(response);
  } catch (error) {
    // ?^ DOMException | TypeError | SyntaxError.
    // Any cause from request abortion to a network error.
    return new RequestError(error);
  }
}
```

The [$trycatch](#utility-trycatch) utility further enhances this process by eliminating the need for try/catch blocks. Composition is also possible, allowing tasks to be chained together while handling expected errors.

```typescript
function task() {
  // Compute the result and exclude the error.
  const result1: number | Error1 = task1();
  if (result1 instanceof Error1) return result1;

  // Compute the result and exclude the error.
  const result2: number | Error2 = task2();
  if (result2 instanceof Error2) return result2;

  const result = result1 + result2;
}
```
The [$macro](#utility-macro) utility simplifies this process by managing the flow of expected errors across multiple tasks.

# Usage

To enhance the usage of these conventions, this library provides two utilities.

## Installation

```sh
npm install @tszen/trycatch
```

## Utility: `$macro`

This utility provides access to the successful result of a task and automatically propagates any errors to the caller. It enables task composition in a concise and **type safe** way, without the need for manual error checks.

```typescript
function task1(): number | Error1;
function task2(): number | Error2;
```

Given these task definitions, we can compute the sum of their results like so:

```typescript
// ?^ result: number | Error1 | Error2
const result = $macro(function* ($try) {
  const result1: number = yield* $try(task1());
  const result2: number = yield* $try(task2());

  return result1 + result2;
});
```

This utility draws strong inspiration from the `try` operator in Zig. It’s important to note that `$macro` accept tasks following our convention and returns a result adhering to the same convention. This ensures the abstraction remains confined to its intended scope, preventing it from leaking into other parts of the codebase — neither in the caller nor the callee.

## Utility: `$trycatch`

The `$trycatch` utility allows you to handle unexpected errors in a clean, structured way by removing the need for traditional try/catch blocks.

```typescript
const [result, err] = $trycatch(task);
```

This utility adopts a Go-style tuple approach: the first element represents the task’s result, and the second contains any unexpected error. Exactly one of these values will be present, while the other will be `null`.

By leveraging TypeScript’s type system, we ensure that the result remains `unknown` until the error is explicitly checked and handled, preventing the accidental use of the result when an error is present.

```typescript
const [result, err] = $trycatch(() => "succeed!");
// ?^ result: unknown
// ?^ err: Error | null

if (err !== null) {
  return;
}

result;
// ?^ result: string
```

`err` is an `Error` object that encapsulate the thrown values and expose them through `Error.cause`. The utility also extends to asynchronous tasks and promises.

```typescript
// Async functions.
const [result, err] = await $trycatch(async () => { ... });
```

```typescript
// Or Promises.
const [result, err] = await $trycatch(new Promise(...));
```

# Limitations

Here is a list of known limitations:

- `$trycatch` must be passed functions to be executed, rather than their results. While this isn't as seamless as a language feature would behave, it’s a limitation due to the constraints of JavaScript syntax. However, `$macro` and `$try` do not share this issue.
- Return types must differ from `unknown` or `any`, as these types will obscure the expected error types in the result. You can work around this by wrapping the return value in an object like `{ value }`.
- Errors and Promises have specific roles when used in return types and cannot be treated as generic values. While we believe this is a positive guideline rather than a limitation, you can still get around this by using `{ value }` as a wrapper.
- Union types of native JavaScript errors will be simplified in TypeScript to a single error type, losing valuable information. For example, `TypeError | RangeError` will be type reduced to `TypeError`. This is a limitation can be addressed by relying only on custom errors and wrapping native ones when needed.

# License

Copyright © 2024 [**tszen**](https://github.com/ts-zen) • [**MIT license**](LICENSE).
