import React, { useState,useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";
import LecturerDropdown from "../components/LecturerDropdown";
import "./StudentIssueReport.css";

const StudentIssueReport = () => {
  
  const [categoryName, setCategoryName] = useState(null);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [file, setFile] = useState(null);


  //API key or token
   const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNDQ5NjU0LCJpYXQiOjE3NDM0NDYwNTQsImp0aSI6IjFmNTBmMDliZGYyNDRiZDk4NWIyNDEyMzlhMGJmMjNmIiwidXNlcl9pZCI6Mn0.0aSC0lj0FAgsrpQTT_BYs4c6kNlCk7ruKepff-JKLTk";
  


  const handleLecturerSelection = (lecturer) => {
    setSelectedLecturer(lecturer);
  };

  const handleCourseCodeSelection = (courseCode) => {
    setSelectedCourseCode(courseCode);
  };
  const handleCourseChange = (e) => {
    setSelectedCourse(parseInt(e.target.value) || "");
  };
  const handleStudentChange = (e) => {
    setSelectedStudent(parseInt(e.target.value) || "");
  };
  

  const handleFileChange = (event)  => {
    setFile(event.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
   alert(`ISSUE SUMMARY:
    \nIssue Title: ${issueTitle}
    \nLecturer: ${selectedLecturer}
    \nPriority: ${selectedPriority}
    \nCategory: ${categoryName}
    \nCourseCode: ${selectedCourseCode}
    \nIssue Description: ${issueDescription}
    \nStudent_ID: ${selectedStudent}
    \nCourse_ID: ${selectedCourse}
    `);

    console.log("API Token:", apiToken);

    //Create category
    let categoryId;
    try{
      const categoryResponse = await axios.post(
        "https://kennedymutebi7.pythonanywhere.com//issues/api/categories/",
        {name: categoryName},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiToken}`,
          },
        }
      );
      categoryId = categoryResponse.data.id; // Get the ID of the created category
      console.log("API Response:", categoryResponse.data);
    } catch (error) {
      console.error("Failed to create category:", error.response ? error.response.data : error);
    
    }

    // Submit issue to API
    const formData =  new FormData();
    formData.append("title", issueTitle);
    formData.append("lecturer", selectedLecturer);
    formData.append("priority", selectedPriority);
    formData.append("category", parseInt(categoryId));
    formData.append("description", issueDescription);
    formData.append("Coursecode", selectedCourseCode);
    formData.append("student", selectedStudent? parseInt(selectedStudent): null);
    formData.append("course",selectedCourse? parseInt(selectedCourse): null);
    if (file) {
      formData.append("attachment", file);
    }
    console.log("Submitting issue...");
      try {
        const response = await axios.post(
          "https://kennedymutebi7.pythonanywhere.com//issues/api/issues/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${apiToken}`,
            },
          }
        );
        alert("Issue submitted successfully!");
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Failed to submit issue:", error.response ? error.response.data : error);
        alert("Failed to submit issue. Please try again.");
      }
    };


  return (
    <div className="student-issue-report-container">
      <StudentSidebar />
      <div className="student-issue-report-content">
        <h1 className="student-issue-report-title">📩 REPORT AN ISSUE</h1>
        <p className="student-issue-report-description">Select a lecturer, categorize your issue, and describe it below. You can also attach any relevant files.</p>
        <hr className="student-issue-report-divider" />
        <form className="student-issue-report-form" onSubmit={handleSubmit}>
          {/* Issue Title */}
          <div className="student-issue-report-form-group">
            <label className="student-issue-report-label">Issue Title:</label>
            <input type="text"
             placeholder="Enter the Issue Title..." 
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
             required />
          </div>
          
          {/* Lecturer Selection */}
          <div className="student-issue-report-form-group">
            <label className="student-issue-report-label">Select Lecturer:</label>
            <LecturerDropdown onSelect={handleLecturerSelection}
            />
          </div>

          {/* Priority */}
          <label className="student-issue-report-label">Priority Level:</label>
                <select 
                    value={selectedPriority} 
                    onChange={(e) => setSelectedPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>

          {/* Category Issue */}
          <div className="student-issue-report-form-group">
            <div className="student-issue-report-tags-container">
            <label className="student-issue-report-label">Issue Category:</label>
            <div>
          <input type="text" placeholder="Enter your Issue Category Name..." value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
          <br></br>
              
            {/*Course Code */}
              <div>
              <label className="student-issue-report-label">Course Code:</label>
              <input 
                type="text"
                placeholder="Enter the Course Code....."
                value={selectedCourseCode}
                onChange={(e) => {
                  handleCourseCodeSelection(e.target.value);
                  
                }}
                className="student-issue-report-custom-tag-input"
                required
              />
            </div>
          </div>
          </div>
          {/* Course Selection */}
          <div className="student-issue-report-form-group">
            <label className="student-issue-report-label">Enter Course Name:</label>
            <input
            className="student-issue-report-course-input"
              type="text"
              placeholder="Enter Course Name....."
              value={selectedCourse || ""}
              onChange={(e) => handleCourseChange(e.target.value)}
              required
            />
          </div>
          {/* Student Selection */}
          <div className="student-issue-report-form-group">
            <label className="student-issue-report-label">Student ID:</label>
            <input
              type="text"
              placeholder="Enter Student ID..."
              value={selectedStudent || ""}
              onChange={(e) => handleStudentChange(e.target.value)}
              required
            />
          </div>

          {/* Issue Description */}
          <div className="student-issue-report-form-group">
            <label className="student-issue-report-label">Issue Description:</label>
            <textarea
              className="student-issue-report-textarea"
              rows="5"
              placeholder="Describe your issue here..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
          </div>
          <div>
              <label>Attachment (Optional)</label>
              <br></br>
              <div>
              <input  className='attachment'
              type="file"
              id="myFile"
               name="filename"
               onChange={handleFileChange}
               ></input>
              </div>
          </div>
          <br></br>
          <div>
          {/*Submit Button */}
          <button type="submit" className="student-issue-report-submit-button">Submit Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default StudentIssueReport;  // Export the component