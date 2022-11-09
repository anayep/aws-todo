import React from 'react';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

const TaskList = ({ tasks, toggleTask, deleteTask,  enterEditMode}) => {
  return (
    <ul className={styles.tasks}>
      {
      tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          enterEditMode={enterEditMode}
        />
      ))
      }
    </ul>
    
  )
}
export default TaskList