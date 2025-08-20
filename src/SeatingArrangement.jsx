import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeatingArrangement.css';

const SeatingArrangement = () => {
    const navigate = useNavigate();

    // --- State for Modals ---
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [isSubjectsModalVisible, setIsSubjectsModalVisible] = useState(false);
    const [isBlocksModalVisible, setIsBlocksModalVisible] = useState(false);
    const [isExamTypesModalVisible, setIsExamTypesModalVisible] = useState(false);

    // --- State for Form Data ---
    const [formData, setFormData] = useState({
        examinationType: 'Formative Assessment (F.A)-1',
        date: '',
        examName: 'Maths',
        standard: '1',
        block: 'Block-A',
    });

    // --- State for Dynamic Lists ---
    const [examinationTypes, setExaminationTypes] = useState([
        'Formative Assessment (F.A)-1', 'Formative Assessment (F.A)-2', 'Formative Assessment (F.A)-3', 'Formative Assessment (F.A)-4',
        'Summative Assessment (S.A)-1', 'Summative Assessment (S.A)-2'
    ]);
    const [subjects, setSubjects] = useState(['Maths', 'Science', 'Social', 'English', 'Telugu', 'Hindi']);
    const [blocks, setBlocks] = useState(['Block-A', 'Block-B', 'Block-C']);
    
    // --- State for "Add New" Inputs ---
    const [newExamType, setNewExamType] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newBlock, setNewBlock] = useState('');
    
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('seatingHistory');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    // --- Custom Dropdown Handlers ---
    const handleExamTypeChange = (e) => {
        if (e.target.value === 'manage-exam-types') setIsExamTypesModalVisible(true);
        else setFormData(prevState => ({ ...prevState, examinationType: e.target.value }));
    };
    const handleSubjectChange = (e) => {
        if (e.target.value === 'manage-subjects') setIsSubjectsModalVisible(true);
        else setFormData(prevState => ({ ...prevState, examName: e.target.value }));
    };
    const handleBlockChange = (e) => {
        if (e.target.value === 'manage-blocks') setIsBlocksModalVisible(true);
        else setFormData(prevState => ({ ...prevState, block: e.target.value }));
    };
    
    // --- Add/Delete Handlers ---
    const handleAddExamType = () => { if (newExamType && !examinationTypes.includes(newExamType)) { setExaminationTypes([...examinationTypes, newExamType]); setNewExamType(''); }};
    const handleDeleteExamType = (typeToDelete) => {
        const newTypes = examinationTypes.filter(t => t !== typeToDelete);
        if (formData.examinationType === typeToDelete) setFormData(prevState => ({ ...prevState, examinationType: newTypes[0] || '' }));
        setExaminationTypes(newTypes);
    };
    const handleAddSubject = () => { if (newSubject && !subjects.includes(newSubject)) { setSubjects([...subjects, newSubject]); setNewSubject(''); }};
    const handleDeleteSubject = (subjectToDelete) => {
        const newSubjects = subjects.filter(s => s !== subjectToDelete);
        if (formData.examName === subjectToDelete) setFormData(prevState => ({ ...prevState, examName: newSubjects[0] || '' }));
        setSubjects(newSubjects);
    };
    const handleAddBlock = () => { if (newBlock && !blocks.includes(newBlock)) { setBlocks([...blocks, newBlock]); setNewBlock(''); }};
    const handleDeleteBlock = (blockToDelete) => {
        const newBlocks = blocks.filter(b => b !== blockToDelete);
        if (formData.block === blockToDelete) setFormData(prevState => ({ ...prevState, block: newBlocks[0] || '' }));
        setBlocks(newBlocks);
    };
    const handleClearHistory = () => { if (window.confirm("Are you sure?")) { setHistory([]); localStorage.removeItem('seatingHistory'); }};

    // --- Form Submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const timestamp = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        const newEntry = { id: Date.now(), ...formData, timestamp };
        const updatedHistory = [newEntry, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('seatingHistory', JSON.stringify(updatedHistory));
        
        // *** THIS LINE IS UPDATED ***
        navigate('/block-setup', { state: { arrangement: newEntry } });
    };

    const standards = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="container">
            <form className="seating-form" onSubmit={handleSubmit}>
                <h2>Seating Arrangement</h2>

                <div className="form-group">
                    <label htmlFor="examinationType">Examination Type</label>
                    <select id="examinationType" name="examinationType" value={formData.examinationType} onChange={handleExamTypeChange}>
                        {examinationTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        <option value="manage-exam-types" className="manage-option">⚙️ Manage Exam Types...</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Exam Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label htmlFor="examName">Exam Name (Subject)</label>
                    <select id="examName" name="examName" value={formData.examName} onChange={handleSubjectChange}>{subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}<option value="manage-subjects" className="manage-option">⚙️ Manage Subjects...</option></select>
                </div>
                <div className="form-group">
                    <label htmlFor="standard">Select the Standard</label>
                    <select id="standard" name="standard" value={formData.standard} onChange={(e) => setFormData({...formData, standard: e.target.value})}>{standards.map(std => <option key={std} value={std}>{std}</option>)}</select>
                </div>
                <div className="form-group">
                    <label htmlFor="block">Select Block</label>
                    <select id="block" name="block" value={formData.block} onChange={handleBlockChange}>{blocks.map(block => <option key={block} value={block}>{block}</option>)}<option value="manage-blocks" className="manage-option">⚙️ Manage Blocks...</option></select>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="history-btn" onClick={() => setIsHistoryVisible(true)}>
                        History ({history.length})
                    </button>
                    <button type="submit" className="proceed-btn">Proceed</button>
                </div>
            </form>

            {/* --- ALL MODALS --- */}
            {isHistoryVisible && (
                 <div className="modal-overlay" onClick={() => setIsHistoryVisible(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Allocation History</h2><button className="close-btn" onClick={() => setIsHistoryVisible(false)}>✖</button></div>
                        <div className="modal-body">
                            {history.length > 0 ? history.map(item => (
                                <div key={item.id} className="history-item">
                                    <h4>{item.examName} - Standard {item.standard}</h4>
                                    <p><strong>Type:</strong> {item.examinationType}</p>
                                    <p><strong>Exam Date:</strong> {new Date(item.date).toLocaleDateString('en-GB')}</p>
                                    <p><strong>Block:</strong> {item.block}</p>
                                    <div className="history-timestamp">Saved on: {item.timestamp}</div>
                                </div>
                            )) : <p>No history found.</p>}
                        </div>
                        <div className="modal-footer"><button className="clear-history-btn" onClick={handleClearHistory} disabled={history.length === 0}>Clear All History</button></div>
                    </div>
                </div>
            )}
            {isExamTypesModalVisible && (
                 <div className="modal-overlay" onClick={() => setIsExamTypesModalVisible(false)}>
                    <div className="modal-content management-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Manage Exam Types</h2><button className="close-btn" onClick={() => setIsExamTypesModalVisible(false)}>✖</button></div>
                        <div className="modal-body">
                            <div className="add-item-form"><input type="text" placeholder="Add new exam type" value={newExamType} onChange={(e) => setNewExamType(e.target.value)} autoFocus/><button onClick={handleAddExamType}>Add</button></div>
                            <ul className="item-list">{examinationTypes.map(type => <li key={type}>{type}<button className="delete-btn" onClick={() => handleDeleteExamType(type)}>✖</button></li>)}</ul>
                        </div>
                    </div>
                </div>
            )}
            {isSubjectsModalVisible && (
                 <div className="modal-overlay" onClick={() => setIsSubjectsModalVisible(false)}>
                    <div className="modal-content management-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Manage Subjects</h2><button className="close-btn" onClick={() => setIsSubjectsModalVisible(false)}>✖</button></div>
                        <div className="modal-body">
                            <div className="add-item-form"><input type="text" placeholder="Add new subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} autoFocus/><button onClick={handleAddSubject}>Add</button></div>
                            <ul className="item-list">{subjects.map(subject => <li key={subject}>{subject}<button className="delete-btn" onClick={() => handleDeleteSubject(subject)}>✖</button></li>)}</ul>
                        </div>
                    </div>
                </div>
            )}
            {isBlocksModalVisible && (
                 <div className="modal-overlay" onClick={() => setIsBlocksModalVisible(false)}>
                    <div className="modal-content management-modal" onClick={e => e.stopPropagation()}>
                         <div className="modal-header"><h2>Manage Blocks</h2><button className="close-btn" onClick={() => setIsBlocksModalVisible(false)}>✖</button></div>
                         <div className="modal-body">
                            <div className="add-item-form"><input type="text" placeholder="Add new block" value={newBlock} onChange={(e) => setNewBlock(e.target.value)} autoFocus/><button onClick={handleAddBlock}>Add</button></div>
                            <ul className="item-list">{blocks.map(block => <li key={block}>{block}<button className="delete-btn" onClick={() => handleDeleteBlock(block)}>✖</button></li>)}</ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatingArrangement;