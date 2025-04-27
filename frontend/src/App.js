import React, { useState, useEffect } from 'react';

function App() {
  const [userId, setUserId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Store name and surname
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [trackingData, setTrackingData] = useState(() => {
    const savedData = localStorage.getItem('trackingData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [filters, setFilters] = useState({
    userId: '',
    name: '',
    surname: '',
    category: '',
    subcategory: '',
  });

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const savedUserDetails = localStorage.getItem('userDetails');
    if (savedLoggedIn && savedUserDetails) {
      setLoggedIn(true);
      setUserDetails(JSON.parse(savedUserDetails)); // Restore userDetails
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filtered data based on user input
  const filteredData = trackingData.filter((entry) => {
    return (
      (entry.userId?.toLowerCase() || '').includes(filters.userId?.toLowerCase() || '') &&
      (entry.name?.toLowerCase() || '').includes(filters.name?.toLowerCase() || '') &&
      (entry.surname?.toLowerCase() || '').includes(filters.surname?.toLowerCase() || '') &&
      (entry.category?.toLowerCase() || '').includes(filters.category?.toLowerCase() || '') &&
      (entry.subcategory?.toLowerCase() || '').includes(filters.subcategory?.toLowerCase() || '')
    );
  });

  // Function to save tracking data to the backend
  const saveTrackingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/save_tracking_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData),
      });
      if (response.ok) {
        console.log('Tracking data saved successfully');
      } else {
        console.error('Failed to save tracking data');
      }
    } catch (error) {
      console.error('Error saving tracking data:', error);
    }
  };

  // Function to clear tracking data
  const clearTrackingData = () => {
    saveTrackingData(); // Save data to the backend before clearing
    setTrackingData([]);
    localStorage.removeItem('trackingData');
  };

  // Schedule clearing at 2:00 AM
  useEffect(() => {
    const now = new Date();
    const nextClearTime = new Date();
    nextClearTime.setHours(2, 0, 0, 0); // Set to 2:00 AM
    if (now > nextClearTime) {
      nextClearTime.setDate(nextClearTime.getDate() + 1); // Move to the next day
    }
    const timeUntilClear = nextClearTime - now;

    // Set a timeout to clear data at 2:00 AM
    const timeout = setTimeout(() => {
      clearTrackingData();
      // Set an interval to clear data every 24 hours after the first clear
      setInterval(clearTrackingData, 24 * 60 * 60 * 1000);
    }, timeUntilClear);

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [trackingData]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (userId.trim()) {
      try {
        const response = await fetch('http://localhost:5000/validate_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails({ name: data.name, surname: data.surname });
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true'); // Save logged-in state
          localStorage.setItem('userDetails', JSON.stringify({ name: data.name, surname: data.surname })); // Save userDetails
        } else {
          alert('Invalid user ID');
        }
      } catch (error) {
        console.error('Error validating user:', error);
      }
    }
  };

  const categories = {
    'PRZYJĘCIE DOSTAWY': ['Wiszące', 'Koszule', 'Karton', 'Buty'],
    'KOMPLETACJA': ['Grupówka', 'Jednorazy', '002', '030', 'Zagranica'],
    'PAKOWANIE': ['Pakowanie WWW'],
    'ZWROTY': ['Zwroty 002', 'Zwroty Zagranica', 'Zwroty WWW', 'Lokowanie Zwrotów'],
    'JAKOŚĆ': ['Kontrola Jakości', 'Kontrola Zagranica', 'Czyszczenie Lokacji', 'Defekty', 'Przemieszczenia'],
    'CZYNNOŚCI DODATKOWE': [
      'Przeklejanie Cen',
      'Wywieszanie na Wieszaki',
      'Przemieszczenia',
      'Pomoc Biuro',
      'Porządki',
      'Targi/Eventy',
      'Transport',
      'Inne',
    ],
    'SPECJALIŚCI': [],
    'PRZERWA': [],
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleStartTracking = () => {
    const now = new Date();

    // Pause all other tasks for the logged-in user
    const updatedTrackingData = trackingData.map((entry) =>
      entry.userId === userId && !entry.paused
        ? { ...entry, paused: true, totalTime: entry.totalTime + Math.floor((now - new Date(entry.startTime)) / 1000), startTime: null }
        : entry
    );

    // Check if the selected task already exists
    const existingTaskIndex = updatedTrackingData.findIndex(
      (entry) =>
        entry.userId === userId &&
        entry.category === selectedCategory &&
        (entry.subcategory === selectedSubcategory || selectedCategory === 'PRZERWA')
    );

    if (existingTaskIndex !== -1) {
      // Resume the existing task
      updatedTrackingData[existingTaskIndex] = {
        ...updatedTrackingData[existingTaskIndex],
        paused: false,
        startTime: now,
      };
    } else {
      // Start a new task
      updatedTrackingData.push({
        userId,
        name: userDetails.name,
        surname: userDetails.surname,
        category: selectedCategory,
        subcategory: selectedCategory === 'PRZERWA' ? null : selectedSubcategory,
        startTime: now,
        paused: false,
        totalTime: 0,
      });
    }

    setTrackingData(updatedTrackingData);
    localStorage.setItem('trackingData', JSON.stringify(updatedTrackingData));

    // Collapse categories and subcategories
    setSelectedCategory('');
    setSelectedSubcategory('');

    // Reset loggedIn state to return to the login page
    setLoggedIn(false);
    localStorage.removeItem('loggedIn'); // Clear logged-in state from localStorage
  };

  const handlePauseTask = (index) => {
    const updatedData = [...trackingData];
    const now = new Date();

    // Calculate the elapsed time until the pause
    const elapsed = Math.floor((now - new Date(updatedData[index].startTime)) / 1000);
    updatedData[index].totalTime += elapsed; // Add elapsed time to totalTime
    updatedData[index].paused = true; // Mark the task as paused
    updatedData[index].startTime = null; // Clear the startTime since it's paused

    setTrackingData(updatedData);
    localStorage.setItem('trackingData', JSON.stringify(updatedData));
  };

  const handleResumeTask = (index) => {
    const updatedData = [...trackingData];
    updatedData[index].paused = false; // Mark the task as resumed
    updatedData[index].startTime = new Date(); // Set the new start time

    setTrackingData(updatedData);
    localStorage.setItem('trackingData', JSON.stringify(updatedData));
  };

  const formatTime = (startTime, totalTime, paused) => {
    const now = new Date();
    const elapsed = paused || !startTime ? 0 : Math.floor((now - new Date(startTime)) / 1000);
    const totalElapsed = totalTime + elapsed;

    if (totalElapsed >= 3600) {
      // Convert to hours if total elapsed time is 3600 seconds (1 hour) or more
      const hours = Math.floor(totalElapsed / 3600);
      const minutes = Math.floor((totalElapsed % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      // Display in minutes and seconds if less than 1 hour
      const minutes = Math.floor(totalElapsed / 60);
      const seconds = totalElapsed % 60;
      return `${minutes}m ${seconds}s`;
    }
  };

  // Recalculate elapsed time on page refresh
  useEffect(() => {
    setTrackingData((prevData) =>
      prevData.map((entry) => {
        if (!entry.paused) {
          const now = new Date();
          const elapsed = Math.floor((now - new Date(entry.startTime)) / 1000);
          return { ...entry, totalTime: entry.totalTime + elapsed, startTime: now };
        }
        return entry;
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData((prevData) =>
        prevData.map((entry) => {
          if (!entry.paused) {
            const now = new Date();
            const elapsed = Math.floor((now - new Date(entry.startTime)) / 1000);
            return { ...entry, totalTime: entry.totalTime + elapsed, startTime: now };
          }
          return entry;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }), // Include the user ID
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Failed to start task');
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleStopAllTasks = () => {
    const now = new Date();

    // Pause all ongoing tasks for the logged-in user
    const updatedTrackingData = trackingData.map((entry) => {
      if (entry.userId === userId && !entry.paused) {
        return {
          ...entry,
          paused: true,
          endTime: now,
        };
      }
      return entry;
    });

    setTrackingData(updatedTrackingData);
    localStorage.setItem('trackingData', JSON.stringify(updatedTrackingData));

    console.log('All tasks stopped for the logged-in user.');

    // Reset loggedIn state and clear userId to return to the login page
    setLoggedIn(false);
    setUserId(''); // Clear the User ID
    localStorage.removeItem('loggedIn'); // Clear logged-in state from localStorage
    localStorage.removeItem('userDetails'); // Clear user details from localStorage
  };

  // Highlight the row in the Live Tracking table
  const isOngoingTask = (entry) => {
    return !entry.paused && entry.userId === userId;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Work Time Tracker</h1>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your ID (e.g., PAK001)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', width: '300px' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      ) : (
        <div>
          <h2>
            Logged in as: {userDetails?.name || 'Unknown'} {userDetails?.surname || ''}
          </h2>
          <p>Select a task category to begin tracking your time.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {Object.keys(categories).map((category) => {
              // Count the number of ongoing tasks for this category
              const ongoingTasks = trackingData.filter(
                (entry) => entry.category === category && !entry.paused
              ).length;

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    position: 'relative', // Enable positioning for the number
                    padding: '20px',
                    fontSize: '16px',
                    width: '200px',
                    height: '100px',
                    cursor: 'pointer',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {category}
                  {ongoingTasks > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '10px',
                        fontSize: '12px',
                        color: '#fff',
                        backgroundColor: '#f44336',
                        borderRadius: '50%',
                        padding: '5px 10px',
                      }}
                    >
                      {ongoingTasks}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Add the "Zakończ pracę" button */}
            <button
              onClick={handleStopAllTasks}
              style={{
                padding: '20px',
                fontSize: '16px',
                width: '200px',
                height: '100px',
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            >
              Zakończ pracę
            </button>
          </div>
          {selectedCategory && selectedCategory !== 'PRZERWA' && (
            <div style={{ marginTop: '20px' }}>
              <h3>Selected Category: {selectedCategory}</h3>
              {categories[selectedCategory].length > 0 ? (
                <div>
                  <p>Select a subcategory:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                    {categories[selectedCategory].map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        style={{
                          padding: '15px',
                          fontSize: '14px',
                          width: '150px',
                          height: '80px',
                          cursor: 'pointer',
                          backgroundColor: '#e0e0e0',
                          color: 'black',
                          border: '1px solid #bbb',
                          borderRadius: '5px',
                          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No subcategories available for this category.</p>
              )}
            </div>
          )}
          {selectedCategory && (selectedCategory === 'PRZERWA' || selectedSubcategory) && (
            <div style={{ marginTop: '20px' }}>
              <h3>Selected {selectedCategory === 'PRZERWA' ? 'Category' : 'Subcategory'}: {selectedCategory === 'PRZERWA' ? selectedCategory : selectedSubcategory}</h3>
              <button
                onClick={handleStartTracking}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  marginTop: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Start Tracking
              </button>
            </div>
          )}
        </div>
      )}
      {trackingData.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h2>Live Tracking</h2>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                  User ID
                  <br />
                  <input
                    type="text"
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    placeholder="Filter by User ID"
                    style={{ width: '90%' }}
                  />
                </th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                  Name
                  <br />
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by Name"
                    style={{ width: '90%' }}
                  />
                </th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                  Surname
                  <br />
                  <input
                    type="text"
                    name="surname"
                    value={filters.surname}
                    onChange={handleFilterChange}
                    placeholder="Filter by Surname"
                    style={{ width: '90%' }}
                  />
                </th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                  Category
                  <br />
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="Filter by Category"
                    style={{ width: '90%' }}
                  />
                </th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                  Subcategory
                  <br />
                  <input
                    type="text"
                    name="subcategory"
                    value={filters.subcategory}
                    onChange={handleFilterChange}
                    placeholder="Filter by Subcategory"
                    style={{ width: '90%' }}
                  />
                </th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: isOngoingTask(entry) ? '#4caf50' : 'transparent', // Highlight ongoing task
                    color: isOngoingTask(entry) ? 'white' : 'black',
                  }}
                >
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{entry.userId}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{entry.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{entry.surname}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{entry.category}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{entry.subcategory || 'N/A'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{formatTime(entry.startTime, entry.totalTime, entry.paused)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;