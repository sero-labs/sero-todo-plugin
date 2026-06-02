/**
 * TodoApp — Sero web UI for the todo extension.
 *
 * Uses useAppState from @sero-ai/app-runtime to read/write the same
 * state.json file the Pi extension writes. Changes from either
 * direction are reflected instantly via file watching.
 *
 * Design: clean, focused task manager — Sero brand accents,
 * DM Sans typography, card-based layout.
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import { useAppState } from '@sero-ai/app-runtime';
import type { TodoState, Todo } from '../shared/types';
import { DEFAULT_TODO_STATE } from '../shared/types';
import { TODO_STYLES } from './styles';

// ── Filter type ──────────────────────────────────────────────

type Filter = 'all' | 'active' | 'done';

// ── TodoApp ──────────────────────────────────────────────────

export function TodoApp() {
  const [state, updateState] = useAppState<TodoState>(DEFAULT_TODO_STATE);
  const [newText, setNewText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = useCallback(() => {
    const text = newText.trim();
    if (!text) return;

    updateState((prev) => ({
      ...prev,
      todos: [
        ...prev.todos,
        {
          id: prev.nextId,
          text,
          done: false,
          createdAt: new Date().toISOString(),
        },
      ],
      nextId: prev.nextId + 1,
    }));
    setNewText('');
    inputRef.current?.focus();
  }, [newText, updateState]);

  const toggleTodo = useCallback(
    (id: number) => {
      updateState((prev) => ({
        ...prev,
        todos: prev.todos.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t,
        ),
      }));
    },
    [updateState],
  );

  const removeTodo = useCallback(
    (id: number) => {
      updateState((prev) => ({
        ...prev,
        todos: prev.todos.filter((t) => t.id !== id),
      }));
    },
    [updateState],
  );

  const clearCompleted = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => !t.done),
    }));
  }, [updateState]);

  const completedCount = state.todos.filter((t) => t.done).length;
  const activeCount = state.todos.filter((t) => !t.done).length;
  const totalCount = state.todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return state.todos.filter((t) => !t.done);
      case 'done': return state.todos.filter((t) => t.done);
      default: return state.todos;
    }
  }, [state.todos, filter]);

  // Sort: active first, then completed
  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return 0;
    });
  }, [filteredTodos]);

  return (
    <>
      <style>{TODO_STYLES}</style>
      <div className="td-root flex h-full w-full flex-col overflow-hidden p-4">
        <div className="td-card flex flex-1 flex-col overflow-hidden p-4">
          {/* Header */}
          <div className="shrink-0 px-5 pb-3 pt-5">
            <div className="flex items-baseline justify-between">
              <h1 className="text-xl tracking-tight" style={{ color: 'var(--td-text)' }}>
                Todos
              </h1>
              {totalCount > 0 && (
                <p className="text-right">
                  <span
                    className="text-xl font-light tabular-nums"
                    style={{ color: 'var(--td-accent)' }}
                  >
                    {activeCount}
                  </span>
                  <span className="ml-1 text-xs" style={{ color: 'var(--td-muted)' }}>
                    remaining
                  </span>
                </p>
              )}
            </div>

            {/* Progress bar */}
            {totalCount > 0 && (
              <div className="td-progress-bar mt-3">
                <div className="td-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {/* Add form */}
          <div className="shrink-0 px-5 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTodo();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="What needs doing?"
                className="td-input flex-1"
              />
              <button
                type="submit"
                disabled={!newText.trim()}
                className="td-button"
              >
                Add
              </button>
            </form>
          </div>

          {/* Filters */}
          {totalCount > 0 && (
            <div className="shrink-0 flex items-center gap-1 px-5 pb-2">
              {(['all', 'active', 'done'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`td-filter-btn ${filter === f ? 'active' : ''}`}
                >
                  {f === 'all' ? `All (${totalCount})` : f === 'active' ? `Active (${activeCount})` : `Done (${completedCount})`}
                </button>
              ))}
            </div>
          )}

          {/* Todo list */}
          <div className="flex-1 overflow-y-auto px-3 py-1">
            {totalCount === 0 ? (
              <EmptyState />
            ) : sortedTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center td-animate-in">
                <p className="text-sm" style={{ color: 'var(--td-muted)' }}>
                  {filter === 'active' ? 'All done! Nothing active.' : 'No completed items yet.'}
                </p>
              </div>
            ) : (
              <ul className="td-animate-in flex flex-col gap-0.5">
                {sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onRemove={removeTodo}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {completedCount > 0 && (
            <div className="shrink-0 flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--td-border)' }}>
              <span className="text-xs" style={{ color: 'var(--td-dim)' }}>
                {completedCount} of {totalCount} completed
              </span>
              <button
                onClick={clearCompleted}
                className="td-clear-btn"
              >
                Clear completed
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components ───────────────────────────────────────────

function TodoItem({
  todo,
  onToggle,
  onRemove,
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <li className="td-todo-item">
      <button
        onClick={() => onToggle(todo.id)}
        className={`td-checkbox ${todo.done ? 'checked' : ''}`}
      >
        {todo.done && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={3}
            stroke="var(--td-accent-foreground)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </button>

      <span
        className="flex-1 text-sm"
        style={{
          color: todo.done ? 'var(--td-dim)' : 'var(--td-text)',
          textDecoration: todo.done ? 'line-through' : 'none',
          transition: 'color 0.15s, text-decoration 0.15s',
        }}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onRemove(todo.id)}
        className="td-remove-btn"
        aria-label="Remove"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center td-animate-in">
      <div className="td-empty-orb mb-5" />
      <h2
        className="text-lg"
        style={{ color: 'var(--td-text)', fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
      >
        All clear
      </h2>
      <p
        className="mt-2 max-w-[220px] text-sm leading-relaxed"
        style={{ color: 'var(--td-muted)' }}
      >
        Add a task above or ask me to create one for you.
      </p>
    </div>
  );
}

export default TodoApp;
