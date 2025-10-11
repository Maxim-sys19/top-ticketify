import {Global, Module} from "@nestjs/common";
import {CqrsModule, EventBus} from "@nestjs/cqrs";

@Global()
@Module({
  imports: [CqrsModule.forRoot()],
  exports: [EventBus]
})
export class CqrsCoreModule {}