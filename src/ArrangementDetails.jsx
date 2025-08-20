import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ArrangementDetails.css'; // We will create this CSS file next

const ArrangementDetails = () => {
    const location = useLocation();
    // Get the data passed from the form page, provide a fallback
    const { arrangement } = location.state || { arrangement: null };

    // If no data was passed (e.g., user navigated directly to the URL)
    if (!arrangement) {
        return (
            <div className="details-container centered">
                <h1>No Data Found</h1>
                <p>Please go back and submit a form first.</p>
                <Link to="/" className="back-link">Go to Form</Link>
            </div>
        );
    }

    return (
        <div className="details-container">
            <h1 className="details-header">Arrangement Confirmed</h1>
            <p className="details-subheader">The following arrangement has been saved to history.</p>

            <div className="details-card">
                <div className="detail-item">
                    <span className="detail-label">Examination Type</span>
                    <span className="detail-value">{arrangement.examinationType}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Subject (Exam Name)</span>
                    <span className="detail-value">{arrangement.examName}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Exam Date</span>
                    <span className="detail-value">{new Date(arrangement.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Standard</span>
                    <span className="detail-value">{arrangement.standard}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Allocated Block</span>
                    <span className="detail-value">{arrangement.block}</span>
                </div>
                <div className="detail-item timestamp">
                    <span className="detail-label">Saved At</span>
                    <span className="detail-value">{arrangement.timestamp}</span>
                </div>
            </div>

            <Link to="/" className="back-link">Create Another Arrangement</Link>
        </div>
    );
};

export default ArrangementDetails;