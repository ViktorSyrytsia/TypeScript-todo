import { ContainerModule, interfaces } from "inversify";

import { TodoListController } from "./controllers/todo-list.controller";
import { TodoListRepository } from "./repositories/todo-list.repository";
import { TodoListService } from "./services/todo-list.service";

export const TodoListModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(TodoListRepository).to(TodoListRepository);
  bind(TodoListService).to(TodoListService);
  bind(TodoListController).to(TodoListController);
});
