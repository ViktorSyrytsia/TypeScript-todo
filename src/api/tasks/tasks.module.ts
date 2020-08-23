import { ContainerModule, interfaces } from "inversify";

import { TasksController } from "./controllers/tasks.controller";
import { TasksRepository } from "./repositories/task.repository";
import { TasksService } from "./services/tasks.service";

export const TasksModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TasksRepository).to(TasksRepository);
  bind(TasksService).to(TasksService);
  bind(TasksController).to(TasksController);
});
