# cargolift-types

Shared TypeScript types and interfaces for Node.js projects.

## Install

```bash
npm install cargolift-types
```

## Usage

```ts
import { Paginated, PageInfo, Result, RequestUser } from 'cargolift-types';

type UserDto = { id: string; name: string };

const pageInfo: PageInfo = {
	page: 1,
	limit: 20,
	totalItems: 123,
	totalPages: 7,
	hasNextPage: true,
	hasPrevPage: false,
};
const users: Paginated<UserDto> = { items: [], pageInfo };

const r: Result<Paginated<UserDto>> = { ok: true, value: users };
```

## What’s inside

- `pagination`: interfaces for paginated results.
- `results`: Result type to describe success/failure responses.

## Development

- `npm run build` – emits `.d.ts` only into `dist/`.
- `npm test` – runs type assertions with `tsd`.
- `npm run lint` – ESLint rules for TS.
- `npm run format` – Prettier.

## Publishing

1. Update version in `package.json`.
2. `npm publish --access public`.

The package only ships `.d.ts` files (no runtime JS).

## License

MIT
