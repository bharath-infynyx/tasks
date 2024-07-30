import styles from "../../ui/dashboard/tasks/tasks.module.css"
import AddTodo from "../../component/todos/AddTodo";
import Todo from "../../component/todos/Todo";
import { prisma } from "../../utils/prisma";


async function getData() {
  const data = await prisma.todo.findMany({
    select: {
      title: true,
      id: true,
      isCompleted: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function TaskPage() {
  const data = await getData();
  return (
    <div className={styles.container}>
      <span className="text-4xl font-extrabold uppercase">User Task/notes</span>
      <h1 className="text-5xl font-extrabold uppercase mb-5 text-center">
        <span className="lowercase"></span>Add Notes
      </h1>

      <div className="flex justify-center flex-col items-center">
        <AddTodo />

        <div>
          {data.map((todo, id) => (
            <div  key={id}>
              <Todo todo={todo} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}