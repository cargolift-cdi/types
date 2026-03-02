# @cargolift-cdi/types

![Versão](https://img.shields.io/badge/version-0.1.166-green)
![Licença](https://img.shields.io/badge/license-MIT-lightgrey)
![Node](https://img.shields.io/badge/node-%3E%3D18-blue)

Biblioteca compartilhada de **tipos, interfaces, enums e entidades TypeORM** do ecossistema Middleware Cargolift.

---

## 📌 Objetivo

Este pacote centraliza os contratos de dados utilizados pelos serviços e libs do middleware, garantindo **padronização**, **consistência** e **baixo acoplamento** entre módulos.

No contexto do monorepo Middleware, ele apoia os princípios de resiliência, segurança, rastreabilidade e escalabilidade ao definir estruturas comuns para:

- mensagens de integração;
- entidades de persistência;
- enums de domínio;
- interfaces de payload e metadados.

Público-alvo:
Desenvolvedores internos do middleware.

---

## ✨ Funcionalidades

- **Contratos de mensageria:** interfaces para uso com RabbitMQ e envelopes de mensagem.
- **Modelos de domínio compartilhados:** entidades TypeORM para integrações, roteamento, rastreamento, MDM e auditoria.
- **Enums padronizados:** protocolos, métodos HTTP, autenticação, status de integração e tracking.
- **Superfície pública unificada:** exportações centralizadas via `src/index.ts`.

Diferenciais Técnicos:
Tipagem forte fim a fim, reaproveitamento entre serviços e redução de divergências de contrato.

---

## 🔍 Detalhamento

### Contratos de Mensageria

Define interfaces para garantir tipagem de mensagens e canais durante publicação/consumo.

#### Exemplo de Uso

```ts
import type { RabbitMQMessage, RabbitMQChannel } from '@cargolift-cdi/types';

export function handleMessage(msg: RabbitMQMessage, channel: RabbitMQChannel) {
	const correlationId = msg.properties.headers['x-correlation-id'];
	if (!correlationId) {
		channel.ack(msg);
		return;
	}

	channel.ack(msg);
}
```

Parâmetros:
`msg: RabbitMQMessage`.
`channel: RabbitMQChannel`.

Retorno:
`void`.

### Entidades de Integração e Governança

Disponibiliza entidades com decorators do TypeORM para persistência de integrações, agentes, endpoints, logs, snapshots, tracking e estruturas MDM.

#### Exemplo de Uso

```ts
import { IntegrationEntity } from '@cargolift-cdi/types';

const entity = new IntegrationEntity();
entity.entity = 'driver';
entity.version = 1;
entity.active = true;
entity.routingMode = 'mdm';
```

Parâmetros:
Campos da entidade conforme o domínio (ex.: `entity`, `version`, `routingMode`).

Retorno:
Instância tipada para uso com repositórios TypeORM.

---

## 🛠 Tecnologias e Dependências

<table>
	<thead>
		<tr>
			<th>Tecnologia</th>
			<th>Versão</th>
			<th>Finalidade</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>TypeScript</td>
			<td>^5.6.2</td>
			<td>Tipagem estática e geração de build ESM</td>
		</tr>
		<tr>
			<td>TypeORM</td>
			<td>^0.3.28</td>
			<td>Decorators e modelagem de entidades compartilhadas</td>
		</tr>
		<tr>
			<td>@types/node</td>
			<td>^24.3.1</td>
			<td>Tipos para APIs Node.js</td>
		</tr>
	</tbody>
</table>

**Dependências Internas (monorepo):**
Consumida por libs e serviços em `libs/*` e `services/*` do workspace middleware.

---

## 🚀 Instalação

### Pré-requisitos

- Node.js: >=18
- pnpm: recomendado para o monorepo

### Passos de Instalação

1. No monorepo, instale dependências na raiz:

```bash
pnpm install
```

2. Para consumo externo (quando publicado), adicione o pacote:

```bash
pnpm add @cargolift-cdi/types
```

---

## 💡 Como Usar

### Quickstart

```ts
import {
	TransportProtocol,
	IntegrationStatus,
	type RabbitMQMessage,
} from '@cargolift-cdi/types';

const protocol = TransportProtocol.REST;
const status = IntegrationStatus.PENDING;

export function parseMessage(msg: RabbitMQMessage) {
	return {
		protocol,
		status,
		headers: msg.properties.headers,
	};
}
```

### Casos de Uso Comuns

- **Padronização de contratos de integração:** uso das interfaces e enums entre API Hub, ESB e conectores.
- **Persistência compartilhada:** reutilização das entidades TypeORM em serviços de domínio e governança.

---

## 📁 Estrutura do Projeto

```text
src/
├── entities/
│   ├── mdm/
│   ├── middleware/
│   └── shared/
├── enum/
├── interfaces/
└── index.ts
```

- **`src/entities/`**: Entidades TypeORM de domínio.
- **`src/enum/`**: Enumerações reutilizáveis.
- **`src/interfaces/`**: Interfaces para payloads, contexto e integração.
- **`src/index.ts`**: Superfície pública de exportação do pacote.

---

## 🧪 Build e Validação

```bash
pnpm --filter @cargolift-cdi/types build
```

Observações:
Este pacote gera artefatos em `dist/` e exporta tipos + código ESM.

---

## 🤝 Contribuindo

Fluxo sugerido no monorepo:

1. Criar branch de feature/bugfix.
2. Aplicar alteração mantendo compatibilidade dos contratos públicos.
3. Executar build do pacote.
4. Abrir PR com descrição do impacto em contratos (`interfaces`, `entities`, `enum`).

Boas práticas:

- Evite mudanças breaking sem versionamento apropriado.
- Mantenha nomes e semântica alinhados ao domínio do middleware.

---

## 📄 Licença

MIT
