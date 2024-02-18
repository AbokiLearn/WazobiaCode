---
title: Typescript 101
date: 2023-01-21
author: Tony Kabilan Okeke
---

# Introduction to TypeScript

<iframe width="560" height="315" src="https://www.youtube.com/embed/d56mG7DezGs?si=VxYCiBXPk1OqhxaV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## What is TypeScript?

TypeScript is a powerful programming language developed and maintained by Microsoft. It is a typed superset of JavaScript, which means any valid JavaScript code is also valid TypeScript code. TypeScript adds optional static typing to JavaScript, enhancing code quality and understandability.

## Why TypeScript?

- **Enhanced Code Quality:** With TypeScript, developers can catch errors early in the development process.
- **Powerful Type System:** TypeScript's type system is robust, including generics and interfaces, which aid in building complex systems.
- **Improved Development Experience:** Features like autocompletion and type inference make TypeScript a joy to work with.
- **Strong Tooling:** Integration with modern development tools and IDEs makes TypeScript development smooth and efficient.

## Getting Started with TypeScript

### Installation

To get started with TypeScript, you need to install Node.js and npm (Node Package Manager). Once you have Node.js and npm installed, you can install TypeScript globally on your system using the following command:

```bash
npm install -g typescript
```

### Compiling Typescript

TypeScript code needs to be compiled to JavaScript. You can compile a TypeScript file (\*.ts) to JavaScript using the TypeScript compiler:

```shell
tsc helloworld.ts
```

This will generate a helloworld.js file from your TypeScript code.

## Basic TypeScript Example

Here's a simple example of TypeScript code:

```typescript
function greet(name: string): string {
  return 'Hello, ' + name;
}

let user = 'Jane Doe';
console.log(greet(user));
```

## Key Typescript Features

- **Types:** Basic types include number, string, boolean, void, null, and undefined.
- **Interfaces:** Define the structure of objects, acting as a contract for object shapes.
- **Classes:** Support for object-oriented programming with classes, inheritance, and modifiers like public, private.
- **Generics:** Provide a way to use types as variables in other types or functions, making code reusable.

## Conclusion

TypeScript is a versatile and powerful language that enhances JavaScript with type safety and better tooling. It's increasingly being used in modern web development projects. Happy coding!
