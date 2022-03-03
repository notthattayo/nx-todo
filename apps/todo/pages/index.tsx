import styles from './index.module.css';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Statuses, Task } from '../types';

import axios from 'axios';

export function Index() {
  const router = useRouter();
  const queryClient = new QueryClient();
  const refreshData = () => {
    //router.replace(router.asPath);
    router.reload();
  };

  const [currentTask, setCurrentTask] = useState<string>('');
  const [clickedTask, setClickedTask] = useState<Number>(-1);
  //const [realData, setRealData] = useState<Task[] | []>([]);
  const baseApiUrl = 'http://localhost:3100/api';

  const getTasks = async () => {
    const res = await fetch(`${baseApiUrl}/tasks`);
    return res.json();
  };

  const { data, status } = useQuery('tasks', getTasks);

  const addTask = async () => {
    const res = await axios.post(`${baseApiUrl}/add-tasks`, {
      status: Statuses.pending,
      task: currentTask,
    });
    setCurrentTask('');
    //
    return res;
  };

  const addTaskMutation = useMutation(addTask, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('tasks').then(() => {
        console.log(data, 'fetched');
        refreshData();
      });
    },
  });

  const updateCurrentTask = (value: string) => {
    setCurrentTask(value);
  };

  const updateTask = async (values: Task) => {
    const res = await axios.put(`${baseApiUrl}/edit-task`, {
      id: values.id,
      status: values.status,
      task: values.task,
    });
    setCurrentTask('');
    refreshData();
    return res;
  };

  const updateTaskMutation = useMutation(updateTask, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('tasks');
    },
  });

  const deleteTask = async (values: Task) => {
    const res = await axios.post(`${baseApiUrl}/delete-task`, {
      id: values.id,
      status: values.status,
      task: values.task,
    });
    setCurrentTask('');
    refreshData();
    return res;
  };

  return (
    <div className={styles.page}>
      <h1>NX TO DO APPLICATION</h1>
      <main>
        <input
          placeholder="Enter to do Item"
          value={currentTask}
          onChange={(e) => updateCurrentTask(e.target.value)}
        ></input>

        <button onClick={() => addTaskMutation.mutate()}>Add</button>
        {data && data.length > 0 ? (
          <div>
            <ul>
              {data.map((item: Task) => {
                return (
                  <div className={styles.todo} key={item.id}>
                    {clickedTask !== item.id ? (
                      <p
                        className={`${styles.todo_item} ${
                          item.status === 'completed' ? styles.completed : null
                        }`}
                        onClick={() => {
                          setClickedTask(item.id);
                          setCurrentTask(item.task);
                        }}
                      >
                        {item.task}
                      </p>
                    ) : (
                      <div className={styles.itemInput}>
                        <input
                          placeholder="Enter to do Item"
                          defaultValue={item.task}
                          onChange={(e) => updateCurrentTask(e.target.value)}
                          onClick={() => {
                            setClickedTask(item.id);
                          }}
                        ></input>
                        <span
                          onClick={() => {
                            updateTask({
                              id: item.id,
                              status: item.status,
                              task: currentTask,
                            });
                            setClickedTask(-1);
                          }}
                        >
                          Save
                        </span>
                      </div>
                    )}
                    {item.status === 'completed' ? (
                      <p
                        className={styles.todo_item_complete}
                        onClick={() =>
                          updateTask({
                            id: item.id,
                            status: Statuses.pending,
                            task: item.task,
                          })
                        }
                      >
                        Mark as pending
                      </p>
                    ) : (
                      <p
                        className={styles.todo_item_complete}
                        onClick={() =>
                          updateTask({
                            id: item.id,
                            status: Statuses.completed,
                            task: item.task,
                          })
                        }
                      >
                        Mark as completed
                      </p>
                    )}
                    <p
                      className={styles.todo_item_delete}
                      onClick={() =>
                        deleteTask({
                          id: item.id,
                          status: item.status,
                          task: item.task,
                        })
                      }
                    >
                      Delete Item
                    </p>
                  </div>
                );
              })}
            </ul>
          </div>
        ) : null}
      </main>
    </div>
  );
}

// export const getServerSideProps = async () => {
//   const { data } = await axios.get('http://localhost:3100/api/tasks');
//   return {
//     props: {
//       tasks: data,
//     },
//   };
// };
export default Index;
