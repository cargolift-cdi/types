# @cargolift-cdi/types

Shared TypeScript types and interfaces for Node.js projects. This package is types-only (no runtime JS).

## Install

```bash
# npm
npm install -D @cargolift-cdi/types

# pnpm
pnpm add -D @cargolift-cdi/types

# yarn
yarn add -D @cargolift-cdi/types
```

## Usage

Use type-only imports to avoid emitting runtime code:

```ts
import type { RabbitMQMessage, RabbitMQChannel } from '@cargolift-cdi/types';

function handleMessage(msg: RabbitMQMessage, channel: RabbitMQChannel) {
	const correlationId = msg.properties.headers['x-correlation-id'];
	// ...process...
	channel.ack(msg);
}
```

Example with amqplib:

```ts
import amqp from 'amqplib';
import type { RabbitMQMessage } from '@cargolift-cdi/types';

const conn = await amqp.connect(process.env.AMQP_URL!);
const ch = await conn.createChannel();
await ch.assertQueue('jobs');

ch.consume('jobs', (msg) => {
	if (!msg) return;
	const typedMsg = msg as unknown as RabbitMQMessage;
	// use typedMsg.content, typedMsg.properties.headers, etc.
	ch.ack(msg);
});
```

## What’s inside

- `rabbitmq.interfaces`: tipos para mensagens e canal RabbitMQ.

Notes
- This package ships only `.d.ts` files. There is no runtime code.
- Prefer `import type` (TS 4.5+) so bundlers/Node don’t try to load a runtime module.

## Development

- `npm run build` – emits `.d.ts` only into `dist/`.
  

## Publishing

1. Update version in `package.json`.
2. `npm publish --access public`.

The package only ships `.d.ts` files (no runtime JS).

## License

MIT
