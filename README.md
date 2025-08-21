# pc4399

## Overview

This project supports multiple package managers. Choose the one you prefer and run the corresponding commands below to install dependencies, build the project, and package it. Finally, move the generated package into the `pc4399register` directory.

---

## Installation & Build Instructions

### If using **npm**:
```bash
npm install
npm run build
npm pack
````

### If using **pnpm**:

```bash
pnpm install
pnpm run build
pnpm pack
```

### If using **Yarn**:

```bash
yarn install
yarn build
yarn pack
```

---

## Packaging

After running the above commands, locate the generated package file (e.g., `pc4399-<version>.tgz`) and move it into the `pc4399register` directory:

```bash
mv *.tgz pc4399register/
```

---

## Summary Table

| Package Manager | Install Command | Build Command    | Pack Command |
| --------------- | --------------- | ---------------- | ------------ |
| npm             | `npm install`   | `npm run build`  | `npm pack`   |
| pnpm            | `pnpm install`  | `pnpm run build` | `pnpm pack`  |
| Yarn            | `yarn install`  | `yarn build`     | `yarn pack`  |

---

## Notes

* Ensure that you only use one package manager per project to avoid conflicts.
* The build process may vary depending on your `package.json`, `tsconfig.json`, or your bundler configuration.
