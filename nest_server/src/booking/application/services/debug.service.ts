import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class DebugService {
  constructor(private readonly eventBus: EventBus) {
    console.log('EventBus instance id:', eventBus.constructor.name, this);
  }
}