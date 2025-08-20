import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BlockSetup.css';

const BlockSetup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const blockName = location.state?.arrangement?.block || 'No Block Selected';
    const originalArrangement = location.state?.arrangement;

    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [isLoading, setIsLoading] = useState(true); // To prevent premature saving

    // --- Data Persistence using localStorage ---

    // Load classes for this block when the component mounts
    useEffect(() => {
        const allBlocksData = JSON.parse(localStorage.getItem('schoolLayoutData')) || {};
        const blockClasses = allBlocksData[blockName] || [
            { id: 1, name: 'Class 1', benches: 10, studentsPerBench: 2, isSelected: false },
            { id: 2, name: 'Class 2', benches: 12, studentsPerBench: 2, isSelected: false },
        ];
        setClasses(blockClasses);
        setIsLoading(false); // Mark loading as complete
    }, [blockName]);

    // **THE FIX IS HERE**
    // Save classes to localStorage whenever they change, but ONLY after loading is done.
    useEffect(() => {
        if (isLoading) {
            return; // Don't save anything while the component is still loading its initial state
        }
        const allBlocksData = JSON.parse(localStorage.getItem('schoolLayoutData')) || {};
        allBlocksData[blockName] = classes;
        localStorage.setItem('schoolLayoutData', JSON.stringify(allBlocksData));
    }, [classes, blockName, isLoading]);


    // --- Handler Functions (No changes here) ---

    const handleClassChange = (id, field, value) => {
        setClasses(classes.map(cls => 
            cls.id === id ? { ...cls, [field]: value } : cls
        ));
    };
    const handleAddClass = () => {
        if (newClassName.trim() === '') return;
        const newClass = { id: Date.now(), name: newClassName, benches: 10, studentsPerBench: 2, isSelected: false };
        setClasses([...classes, newClass]);
        setNewClassName('');
    };
    const handleDeleteClass = (id) => {
        setClasses(classes.filter(cls => cls.id !== id));
    };
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setClasses(classes.map(cls => ({ ...cls, isSelected: isChecked })));
    };
    const handleGenerate = () => {
        const selectedClasses = classes.filter(cls => cls.isSelected);
        if (selectedClasses.length === 0) {
            alert('Please select at least one class to generate the seating plan.');
            return;
        }
        // Pass the original arrangement data forward to ensure it can be passed back later
        navigate('/seating-plan', { state: { selectedClasses, blockName, arrangement: originalArrangement } });
    };

    return (
        <div className="setup-container">
            <div className="setup-form">
                <div className="header">
                    <h1>{blockName}</h1>
                    <div className="select-all-container">
                        <input 
                            type="checkbox" 
                            id="selectAll"
                            checked={classes.length > 0 && classes.every(cls => cls.isSelected)}
                            onChange={handleSelectAll} 
                        />
                        <label htmlFor="selectAll">Select All</label>
                    </div>
                </div>
                
                <h2>No. of rooms available</h2>

                <div className="class-list">
                    {classes.map(cls => (
                        <div key={cls.id} className={`class-item ${cls.isSelected ? 'selected' : ''}`}>
                            <input 
                                type="checkbox"
                                className="class-checkbox"
                                checked={cls.isSelected}
                                onChange={(e) => handleClassChange(cls.id, 'isSelected', e.target.checked)}
                            />
                            <span className="class-name">{cls.name}</span>
                            <div className="input-group">
                                <label>No. of benches</label>
                                <input type="number" value={cls.benches} min="0" onChange={(e) => handleClassChange(cls.id, 'benches', parseInt(e.target.value) || 0)}/>
                            </div>
                            <div className="input-group">
                                <label>Students per bench</label>
                                <input type="number" value={cls.studentsPerBench} min="0" onChange={(e) => handleClassChange(cls.id, 'studentsPerBench', parseInt(e.target.value) || 0)}/>
                            </div>
                            <button className="delete-class-btn" onClick={() => handleDeleteClass(cls.id)}>✖</button>
                        </div>
                    ))}
                </div>

                <div className="add-class-container">
                    <h3>Manage Classes</h3>
                    <div className="add-class-form">
                        <input type="text" placeholder="Enter new class name" value={newClassName} onChange={(e) => setNewClassName(e.target.value)}/>
                        <button onClick={handleAddClass}>Add Class</button>
                    </div>
                </div>

                <button className="generate-btn" onClick={handleGenerate}>
                    Generate
                </button>
            </div>
        </div>
    );
};

export default BlockSetup;