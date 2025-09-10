# cargolift-types

Shared TypeScript types and interfaces for Node.js projects.

## Install

```bash
npm install cargolift-types
```

## Usage

```ts
import { RabbitMQMessage, RabbitMQChannel } from '@cargolift-cdi/types';
```

## What’s inside

- `rabbitmq.interfaces`: tipos para mensagens e canal RabbitMQ

## Development

- `npm run build` – emits `.d.ts` only into `dist/`.
  

## Publishing

1. Update version in `package.json`.
2. `npm publish --access public`.

The package only ships `.d.ts` files (no runtime JS).

## License

MIT
