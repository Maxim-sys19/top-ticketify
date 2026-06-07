import { AllTopologies } from '../index';

export const resolverRmqOptionsByQueue = (queueName: string) => {
  for (const topology of AllTopologies) {
    const queue = topology.queues.find((q) => q.name === queueName);
    if (!queue) continue;
    const bindings = queue.bindings ?? [];
    if (bindings.length === 0)
      throw new Error(`Queue : ${queue.name} has no bindings`);
    const exchangeName = bindings[0].exchange;
    const routingKeys: string[] = [];
    for (const binding of bindings) {
      const key = binding.routingKey;
      if (Array.isArray(key)) {
        routingKeys.push(...key);
      } else {
        routingKeys.push(key);
      }
    }
    const exchange = topology.exchanges.find((ex) => ex.name === exchangeName);
    if (!exchange) throw new Error(`Exchange : ${exchangeName} not found`);
    return {
      queue: queue.name,
      exchange: exchange.name,
      exchangeType: exchange.type,
      routingKeys,
      queueOptions: queue.options,
    };
  }
};
