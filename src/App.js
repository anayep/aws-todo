import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CustomForm from './components/CustomForm'
import EditForm from './components/EditForm'
import TaskList from './components/TaskList'

function App() {

  const [tasks, setTasks] = useState([]);
  const [previousFocusEl, setPreviousFocusEl] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


    const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wbgdwbfvi6.execute-api.eu-central-1.amazonaws.com/dev/items');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      console.log(data.Items)
      const transformedMovies = data.Items.map((movieData) => {
        return {
          key: movieData.id,
          id: movieData.id,
          content: movieData.content,
          checked: movieData.checked
        };
      });
      setTasks(transformedMovies);
      console.log(tasks,'in fetch')
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (id,isChecked,text) => {
    setTasks(prevState => prevState.map(t => (
      t.id === id
        ? { ...t, checked: !t.checked }
        : t
    )))
    console.log(!isChecked)
      try {
    const response = await fetch('https://wbgdwbfvi6.execute-api.eu-central-1.amazonaws.com/dev/items/' + id, {
      method: 'PUT',
      body: JSON.stringify({  content: text,
        checked: !isChecked }),
      headers: {
        'Content-type': 'application/json'
    }})
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const data = await response.json();
    console.log(tasks)
  }catch (error) {
    setError(error.message);
  }
  }

  const updateTask = async(task) => {
    setTasks(prevState => prevState.map(t => (
      t.id === task.id
        ? { ...t, content: task.content }
        : t
    )))

    console.log(task.content,task.checked)
    closeEditMode();
    try {
      const response = await fetch('https://wbgdwbfvi6.execute-api.eu-central-1.amazonaws.com/dev/items/' + task.id, {
        method: 'PUT',
        body: JSON.stringify({  content: task.content,
        checked: task.checked === 'true' }),
        headers: {
          'Content-type': 'application/json'
      }})
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
    }catch (error) {
      setError(error.message);
    }
    }


  const closeEditMode = () => {
    setIsEditing(false);
    previousFocusEl.focus();
  }

  const enterEditMode = (task) => {
    setEditedTask(task);
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  }

  const addTask = async (movie) => {
    try {
    const response = await fetch('https://wbgdwbfvi6.execute-api.eu-central-1.amazonaws.com/dev/items', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const data = await response.json();
    setTasks(prevState => [movie,...prevState])

    }catch (error) {
      setError(error.message);
    }
  }

  async function deleteTask(id) {
    const response = await fetch('https://wbgdwbfvi6.execute-api.eu-central-1.amazonaws.com/dev/items/' + id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
    }
    });
    const data = await response.json();
    setTasks(prevState => prevState.filter(t => t.id !== id));
    console.log(data);
  }



  let content = <p>Found no movies.</p>;

  if (tasks.length > 0) {
    content = <TaskList tasks={tasks} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (

    <div className="container">
      <header>
        <h1>My Task List</h1>
      </header>
      {
        isEditing && (
          <EditForm
            editedTask={editedTask}
            updateTask={updateTask}
            closeEditMode={closeEditMode}
          />
        )
      }
      <CustomForm addTask={addTask}/>
      {tasks && (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          enterEditMode={enterEditMode}
        />
      )}
    </div>
  );
}

export default App;
