import React from 'react'
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid'


const CustomForm = ({ addTask }) => {
    const [task, setTask] = useState("");
    const d = new Date();
    let ms = d.valueOf().toString();
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      addTask({
        content: task,
        checked: false,
        id: ms
      })
      setTask("")
    }

    return (
        <form
          className="todo"
          onSubmit={handleFormSubmit}
          >
          <div className="wrapper">
            <input
              type="text"
              id="task"
              className="input"
              value={task}
              onInput={(e) => setTask(e.target.value)}
              required
              autoFocus
              maxLength={60}
              placeholder="Enter Task"
            />
            <label
              htmlFor="task"
              className="label"
            >Enter Task</label>
          </div>
          <button
            className="btn"
            aria-label="Add Task"
            type="submit"
            >
            <PlusIcon />
          </button>
        </form>
      )
    }

export default CustomForm