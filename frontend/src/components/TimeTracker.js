import React, { useState, useEffect } from 'react';

const TimeTracker = ({ selectedTask }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (isTracking) {
            const id = setInterval(() => {
                setTimeElapsed(prevTime => prevTime + 1);
            }, 1000);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [isTracking, intervalId]);

    const handleStartStop = () => {
        setIsTracking(!isTracking);
    };

    const handleReset = () => {
        setTimeElapsed(0);
        setIsTracking(false);
    };

    return (
        <div className="time-tracker">
            <h2>Time Tracker for {selectedTask}</h2>
            <div className="time-display">
                {Math.floor(timeElapsed / 60)}:{('0' + (timeElapsed % 60)).slice(-2)}
            </div>
            <button onClick={handleStartStop}>
                {isTracking ? 'Stop' : 'Start'}
            </button>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default TimeTracker;