import { eq } from "drizzle-orm";
import { db } from "../../db";
import { R, type Result } from "../../utils/result";
import { type NewTodo, type Todo, todos } from "./todo.model";

export class TodoService {
  findAll(): Promise<Result<Todo[], Error>> {
    return R.tryAsync(() => db.select().from(todos));
  }

  findById(id: number): Promise<Result<Todo, Error>> {
    return R.tryAsync(async () => {
      const [todo] = await db.select().from(todos).where(eq(todos.id, id));
      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }
      return todo;
    });
  }

  create(todoData: NewTodo): Promise<Result<Todo, Error>> {
    return R.tryAsync(async () => {
      const [todo] = await db.insert(todos).values(todoData).returning();
      if (!todo) {
        throw new Error("Failed to create todo");
      }
      return todo;
    });
  }

  update(
    id: number,
    todoData: Partial<NewTodo>
  ): Promise<Result<Todo, Error>> {
    return R.tryAsync(async () => {
      const [todo] = await db
        .update(todos)
        .set({ ...todoData, updatedAt: new Date() })
        .where(eq(todos.id, id))
        .returning();

      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }
      return todo;
    });
  }

  deleteTodo(id: number): Promise<Result<boolean, Error>> {
    return R.tryAsync(async () => {
      const [deletedTodo] = await db
        .delete(todos)
        .where(eq(todos.id, id))
        .returning();
      return !!deletedTodo;
    });
  }

  toggle(id: number): Promise<Result<Todo, Error>> {
    return R.tryAsync(async () => {
      const [todo] = await db.select().from(todos).where(eq(todos.id, id));

      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }

      const [updatedTodo] = await db
        .update(todos)
        .set({ completed: !todo.completed, updatedAt: new Date() })
        .where(eq(todos.id, id))
        .returning();

      if (!updatedTodo) {
        throw new Error(`Failed to toggle todo with id ${id}`);
      }

      return updatedTodo;
    });
  }
}
