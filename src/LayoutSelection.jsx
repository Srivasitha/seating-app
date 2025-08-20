import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './LayoutSelection.css'; // We will create this CSS file next

const LayoutSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the data passed from the BlockSetup page
    const { selectedClasses, blockName } = location.state || { selectedClasses: [], blockName: 'Block' };

    // Handle clicks on a specific layout card
    const handleLayoutClick = (classData) => {
        // Navigate to the 4th interface, passing the data for the clicked class
        navigate('/view-plan', { state: { classData, blockName } });
    };

    // If the user navigates here directly without selecting classes
    if (selectedClasses.length === 0) {
        return (
            <div className="layout-container centered-message">
                <h1>No Classes Selected</h1>
                <p>Please go back and generate a plan first.</p>
                <Link to="/" className="back-button">Go to Home</Link>
            </div>
        );
    }

    return (
        <div className="layout-container">
            <h1 className="layout-header">Layouts for {blockName}</h1>
            <p className="layout-subheader">Select a class to view its seating arrangement.</p>
            
            <div className="layout-grid">
                {selectedClasses.map(cls => (
                    <div 
                        key={cls.id} 
                        className="layout-card"
                        onClick={() => handleLayoutClick(cls)}
                        tabIndex="0" // Makes it focusable
                        onKeyPress={(e) => e.key === 'Enter' && handleLayoutClick(cls)}
                    >
                        <div className="card-icon">
                            {/* You can use an icon library or an SVG here */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
                        </div>
                        <div className="card-content">
                            <h2>{cls.name} Layout</h2>
                            <p>{cls.benches} benches • {cls.studentsPerBench} students per bench</p>
                        </div>
                        <div className="card-arrow">
                            <span>&rarr;</span>
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/block-setup" state={{ arrangement: { block: blockName } }} className="back-button">
                &larr; Go Back to Block Setup
            </Link>
        </div>
    );
};

export default LayoutSelection;