import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class SagasStateStore {
  private readonly redisClient: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getOrThrow();
  }
  async get<T = any>(key: string): Promise<T | undefined> {
    try {
      const raw = await this.redisClient.get(key);
      if (!raw) return undefined;
      return JSON.parse(raw);
    } catch (err) {
      console.log('Error getting key', err);
    }
  }
  async set<T = any>(value: T, key: string, ttl?: number): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value), () =>
        ttl ? { EX: ttl } : undefined,
      );
    } catch (err) {
      console.log('Error setting key', err);
    }
  }
  async update<T = any>(key: string, partial: Partial<T>) {
    try {
      const current = ((await this.get<T>(key)) ?? {}) as T;
      console.log('Current redis value :', current);
      const updated = { ...partial, ...current } as T;
      console.log('Updated vl :', updated);
      await this.set<T>(updated, key);
      return updated;
    } catch (e) {
      console.log('Error update redis value :', e);
    }
  }
  async delete(key: string): Promise<void> {
    try {
      const result = await this.redisClient.del(key);
      console.log('delete from redis :', result);
    } catch (err) {
      console.log('Error del key :', err);
    }
  }
}
