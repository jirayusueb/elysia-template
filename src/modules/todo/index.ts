import { Elysia, t } from "elysia";
import { R } from "@/utils/result";
import type { NewTodo } from "./todo.model";
import { TodoService } from "./todo.service";

const todoService = new TodoService();

export const todoModule = new Elysia({ prefix: "/todos" })
  .get("/", async () => {
    const result = await todoService.findAll();
    return R.toResponse(result);
  })
  .get("/:id", async ({ params: { id } }) => {
    const result = await todoService.findById(Number(id));
    return R.toResponse(result);
  })
  .post(
    "/",
    async ({ body }) => {
      const result = await todoService.create(body);
      return R.toResponse(result);
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const result = await todoService.update(
        Number(id),
        body as Partial<NewTodo>
      );
      return R.toResponse(result);
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    }
  )
  .patch("/:id/toggle", async ({ params: { id } }) => {
    const result = await todoService.toggle(Number(id));
    return R.toResponse(result);
  })
  .delete("/:id", async ({ params: { id } }) => {
    const result = await todoService.deleteTodo(Number(id));
    return R.toResponse(result);
  });
