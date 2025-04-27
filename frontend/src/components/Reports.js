import React, { useEffect, useState } from 'react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('/api/reports'); // Adjust the API endpoint as needed
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = (reportId) => {
        // Logic to export the report, e.g., download as CSV
        console.log(`Exporting report with ID: ${reportId}`);
    };

    if (loading) {
        return <div>Loading reports...</div>;
    }

    return (
        <div>
            <h2>Reports</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Task</th>
                        <th>Time Tracked</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id}>
                            <td>{report.employeeId}</td>
                            <td>{report.task}</td>
                            <td>{report.timeTracked}</td>
                            <td>
                                <button onClick={() => exportReport(report.id)}>Export</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;