export interface RabbitMQMessage {
  fields: any;
  content: Buffer;
  properties: {
    headers: Record<string, any>;
    [key: string]: any;
  };
}

export interface RabbitMQChannel {
  publish: (
    exchange: string,
    routingKey: string,
    content: Buffer,
    options: { headers: Record<string, any> }
  ) => boolean;
  ack: (msg: RabbitMQMessage) => void;
}
