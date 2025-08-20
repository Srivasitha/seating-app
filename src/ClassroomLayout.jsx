import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { students as allStudents } from './mockStudentData';
import './ClassroomLayout.css';

const ClassroomLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { classData, blockName, arrangement } = location.state || {};

    const handleDownloadPDF = () => {
        const layoutElement = document.getElementById('layout-to-download');
        if (!layoutElement) return;

        html2canvas(layoutElement, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgRatio = imgProps.width / imgProps.height;
            
            let imgWidth = pdfWidth - 20;
            let imgHeight = imgWidth / imgRatio;

            if (imgHeight > pdfHeight - 20) {
                imgHeight = pdfHeight - 20;
                imgWidth = imgHeight * imgRatio;
            }

            const xOffset = (pdfWidth - imgWidth) / 2;
            pdf.addImage(imgData, 'PNG', xOffset, 10, imgWidth, imgHeight);
            pdf.save(`${classData.name}_${arrangement.examName}_Layout.pdf`);
        });
    };
    
    const handleGoBack = () => {
        navigate('/seating-plan', { state: { selectedClasses: [classData], blockName, arrangement } });
    };

    if (!classData || !arrangement) {
        return (
            <div className="layout-container empty">
                <h2>Data Missing</h2><p>Could not load layout data. Please go back.</p>
                <button onClick={() => navigate('/')} className="back-button">Go to Home</button>
            </div>
        );
    }
    
    const totalSeats = classData.benches * classData.studentsPerBench;
    const assignedStudents = allStudents.slice(0, totalSeats);

    // --- NEW: Logic to count students from each class ---
    const studentCounts = assignedStudents.reduce((acc, student) => {
        if (!student) return acc; // Skip empty seats
        const classSection = `${student.class}-${student.section}`;
        acc[classSection] = (acc[classSection] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="layout-page-container">
            <div id="layout-to-download" className="layout-container">
                <div className="layout-header">
                    <h1>{classData.name} - Seating Layout</h1>
                    <h2>{blockName}</h2>
                    <div className="exam-details">
                        <span><strong>Exam:</strong> {arrangement.examName}</span>
                        <span><strong>Date:</strong> {new Date(arrangement.date).toLocaleDateString('en-GB')}</span>
                    </div>
                </div>

                {/* --- NEW: Student Distribution Section --- */}
                <div className="distribution-container">
                    <h3>Student Distribution</h3>
                    <div className="distribution-pills">
                        {Object.entries(studentCounts).map(([classSection, count]) => (
                            <span key={classSection} className="dist-pill">
                                {classSection}: <strong>{count}</strong>
                            </span>
                        ))}
                    </div>
                </div>

                <table className="seating-table">
                    <thead>
                        <tr>
                            <th>Seat No.</th>
                            <th>Roll No.</th>
                            <th>Student Name</th>
                            <th>Class & Section</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedStudents.map((student, index) => (
                            <tr key={student?.id || index}>
                                <td>{index + 1}</td>
                                <td>{student?.rollNo || '-'}</td>
                                <td>{student?.name || <span className="empty-seat">Empty Seat</span>}</td>
                                <td>{student ? `${student.class}-${student.section}` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button onClick={handleGoBack} className="back-button">← Back to Layouts</button>
                <button onClick={handleDownloadPDF} className="download-btn">Download Layout</button>
            </div>
        </div>
    );
};

export default ClassroomLayout;