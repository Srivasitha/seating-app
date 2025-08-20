import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ClassLayoutList.css';

const ClassLayoutList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Receive the data from the previous page, with fallbacks for safety
    const { selectedClasses, blockName, arrangement } = location.state || {
        selectedClasses: [],
        blockName: 'Unknown Block',
        arrangement: null,
    };

    // --- Navigation Handlers ---

    // Go to the 4th interface (classroom layout)
    const handleLayoutClick = (classData) => {
        navigate('/classroom-layout', { state: { classData, blockName, arrangement } });
    };

    // Go BACK to the 2nd interface (block setup)
    const handleGoBack = () => {
        // We pass the original arrangement data back to preserve state
        navigate('/block-setup', { state: { arrangement } });
    };


    // --- Render Logic ---

    if (selectedClasses.length === 0) {
        return (
            <div className="layout-list-container empty">
                <h2>No classes were selected.</h2>
                <p>Please go back and select at least one class.</p>
                <button onClick={handleGoBack} className="back-button">
                    Go Back to Block Setup
                </button>
            </div>
        );
    }

    return (
        <div className="layout-list-container">
            <h1>Layouts for {blockName}</h1>
            <p className="subheader">Select a class to configure its seating layout.</p>
            
            <div className="class-layout-grid">
                {selectedClasses.map((cls) => (
                    <div key={cls.id} className="class-layout-card" onClick={() => handleLayoutClick(cls)}>
                        <h2 className="class-name">{cls.name}</h2>
                        <div className="class-info">
                            {cls.benches} Benches | {cls.studentsPerBench * cls.benches} Seats
                        </div>
                        <div className="layout-button">
                            <span>Configure Layout</span>
                            <span className="arrow">→</span>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleGoBack} className="back-button">
                ← Go Back to Block Setup
            </button>
        </div>
    );
};

export default ClassLayoutList;