import { createSSGHelpers } from '@trpc/react/ssg';
import clsx from 'clsx';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useIsMutating } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import { inferQueryOutput, trpc, transformer } from '../utils/trpc';
import { appRouter, createContext } from './api/trpc/[trpc]';
type Task = inferQueryOutput<'todos.all'>[number];

/**
 * Hook for checking when the user clicks outside the passed ref
 */
function useClickOutside({
  ref,
  callback,
  enabled,
}: {
  ref: RefObject<any>;
  callback: () => void;
  enabled: boolean;
}) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!enabled) {
      return;
    }
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, enabled]);
}
function ListItem({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useContext();
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  useEffect(() => {
    setText(task.text);
  }, [task.text]);
  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const editTask = trpc.useMutation('todos.edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['todos.all']);
      utils.setQueryData(
        ['todos.all'],
        allTasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...data,
              }
            : t,
        ),
      );
    },
  });
  const deleteTask = trpc.useMutation('todos.delete', {
    async onMutate() {
      await utils.cancelQuery(['todos.all']);
      utils.setQueryData(
        ['todos.all'],
        allTasks.filter((t) => t.id != task.id),
      );
    },
  });

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTask.mutate({
        id: task.id,
        data: { text },
      });
      setEditing(false);
    },
  });
  return (
    <li
      key={task.id}
      className={clsx(editing && 'editing', completed && 'completed')}
      ref={wrapperRef}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setCompleted(checked);
            editTask.mutate({
              id: task.id,
              data: { completed: checked },
            });
          }}
          autoFocus={editing}
        />
        <label
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
        >
          {text}
        </label>
        <button
          className="destroy"
          onClick={() => {
            deleteTask.mutate(task.id);
          }}
        />
      </div>
      <input
        className="edit"
        value={text}
        ref={inputRef}
        onChange={(e) => {
          const newText = e.currentTarget.value;
          setText(newText);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            editTask.mutate({
              id: task.id,
              data: { text },
            });
            setEditing(false);
          }
        }}
      />
    </li>
  );
}

export default function TodosPage({
  filter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const allTasks = trpc.useQuery(['todos.all'], {
    staleTime: 3000,
  });
  const utils = trpc.useContext();
  const addTask = trpc.useMutation('todos.add', {
    async onMutate({ text }) {
      await utils.cancelQuery(['todos.all']);
      const tasks = allTasks.data ?? [];
      utils.setQueryData(
        ['todos.all'],
        [
          ...tasks,
          {
            id: `${Math.random()}`,
            completed: false,
            text,
            createdAt: new Date(),
          },
        ],
      );
    },
  });

  const clearCompleted = trpc.useMutation('todos.clearCompleted', {
    async onMutate() {
      await utils.cancelQuery(['todos.all']);
      const tasks = allTasks.data ?? [];
      utils.setQueryData(
        ['todos.all'],
        tasks.filter((t) => !t.completed),
      );
    },
  });

  const number = useIsMutating();
  useEffect(() => {
    // invalidate queries when mutations have settled
    // doing this here rather than in `onSettled()`
    // to avoid race conditions if you're clicking fast
    if (number === 0) {
      utils.invalidateQuery(['todos.all']);
    }
  }, [number, utils]);
  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyDown={(e) => {
              const text = e.currentTarget.value.trim();
              if (e.key === 'Enter' && text) {
                addTask.mutate({ text });
                e.currentTarget.value = '';
              }
            }}
          />
        </header>
        {/* This section should be hidden by default and shown when there are todos */}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* These are here just to show the structure of the list items */}
            {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
            {allTasks.data
              ?.filter((task) => {
                if (filter === 'active') {
                  return !task.completed;
                }
                if (filter === 'completed') {
                  return task.completed;
                }
                return true;
              })
              .map((task) => (
                <ListItem key={task.id} task={task} allTasks={allTasks.data} />
              ))}
          </ul>
        </section>
        {/* This footer should be hidden by default and shown when there are todos */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>
              {allTasks.data?.reduce(
                (sum, task) => (!task.completed ? sum + 1 : sum),
                0,
              )}
            </strong>{' '}
            item left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <Link href="/all">
                <a
                  className={clsx(
                    !['active', 'completed'].includes(filter as string) &&
                      'selected',
                  )}
                >
                  All
                </a>
              </Link>
            </li>
            <li>
              <Link href="/active">
                <a className={clsx(filter === 'active' && 'selected')}>
                  Active
                </a>
              </Link>
            </li>
            <li>
              <Link href="/completed">
                <a className={clsx(filter === 'completed' && 'selected')}>
                  Completed
                </a>
              </Link>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          {allTasks.data?.some((task) => task.completed) && (
            <button
              className="clear-completed"
              onClick={() => {
                clearCompleted.mutate(null);
              }}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        {/* Remove the below line ↓ */}
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        {/* Change this out with your name and url ↓ */}
        <p>
          Created with <a href="http://trpc.io">tRPC</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['active', 'completed', 'all'].map((filter) => ({
      params: { filter },
    })),

    fallback: false,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ filter: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    transformer,
    ctx: await createContext(),
  });

  await ssg.fetchQuery('todos.all');

  // console.log('state', ssr.dehydrate());
  return {
    props: {
      trpcState: ssg.dehydrate(),
      filter: context.params?.filter ?? 'all',
    },
    revalidate: 1,
  };
};
