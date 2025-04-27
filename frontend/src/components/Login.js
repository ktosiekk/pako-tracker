import React, { useState } from 'react';

const Login = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add authentication logic here
        if (employeeId) {
            // Simulate a successful login
            console.log(`Employee ID: ${employeeId}`);
            setError('');
            // Redirect to the main application or perform further actions
        } else {
            setError('Please enter a valid Employee ID');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;