import React from 'react';
import './TaskTiles.css'; // Assuming you have a CSS file for styling

const TaskTiles = ({ tasks, onSelectTask }) => {
    return (
        <div className="task-tiles">
            {tasks.map(task => (
                <div 
                    key={task.id} 
                    className="task-tile" 
                    onClick={() => onSelectTask(task)}
                >
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                </div>
            ))}
        </div>
    );
};

export default TaskTiles;