/*
================================================================================
|                                                                              |
|   File: App.js                                                               |
|   Description: The main React component for the user interface.              |
|   UI: Enhanced with Tailwind CSS for a modern look.                          |
|                                                                              |
================================================================================
*/
import React, { useState } from 'react';
import axios from 'axios';
// Note: We keep the App.css import to include the Tailwind directives.
import './App.css'; 

function App() {
    // State variables to hold the data from the input fields
    const [trainNumber, setTrainNumber] = useState('');
    const [platformNumber, setPlatformNumber] = useState('');
    const [anncType, setAnncType] = useState('Arrive Shortly');

    // State to hold the data we get back from the server
    const [announcementData, setAnnouncementData] = useState(null);

    // State to manage loading and error messages
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // This function is called when the "Generate" button is clicked
    const handleGenerate = async () => {
        setAnnouncementData(null);
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/generate', {
                trainNumber,
                platformNumber,
                anncType
            });
            setAnnouncementData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
                <header className="text-center my-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">🚆 South Central Railway Announcement System</h1>
                </header>
                
                <main>
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-2">Train Number</label>
                                <input
                                    id="trainNumber"
                                    type="text"
                                    value={trainNumber}
                                    onChange={(e) => setTrainNumber(e.target.value)}
                                    placeholder="e.g., 12723"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label htmlFor="platformNumber" className="block text-sm font-medium text-gray-700 mb-2">Platform Number</label>
                                <input
                                    id="platformNumber"
                                    type="text"
                                    value={platformNumber}
                                    onChange={(e) => setPlatformNumber(e.target.value)}
                                    placeholder="e.g., 4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label htmlFor="anncType" className="block text-sm font-medium text-gray-700 mb-2">Announcement Type</label>
                                <select id="anncType" value={anncType} onChange={(e) => setAnncType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                    <option value="Arrive Shortly">Arrive Shortly</option>
                                    <option value="Ready to Leave">Ready to Leave</option>
                                    <option value="Is On">Is On</option>
                                </select>
                            </div>
                        </div>
                        
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-8 p-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isLoading ? 'Generating...' : 'Generate Announcement'}
                        </button>
                    </div>

                    {error && <div className="mt-6 text-red-700 bg-red-100 border border-red-300 rounded-lg p-4 text-center">{error}</div>}

                    {announcementData && (
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-6">
                            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Announcement Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Train Number</p><p className="font-semibold text-gray-900">{announcementData['Train No']}</p></div>
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Train Name</p><p className="font-semibold text-gray-900">{announcementData['Train Name']}</p></div>
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">From</p><p className="font-semibold text-gray-900">{announcementData.FROM}</p></div>
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">To</p><p className="font-semibold text-gray-900">{announcementData.TO}</p></div>
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Type</p><p className="font-semibold text-gray-900">{announcementData['train type']}</p></div>
                                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Platform</p><p className="font-semibold text-gray-900">{announcementData.platformNumber}</p></div>
                            </div>
                            <audio controls autoPlay key={announcementData.audioUrl} className="w-full mt-4">
                                <source src={`http://localhost:5000${announcementData.audioUrl}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
