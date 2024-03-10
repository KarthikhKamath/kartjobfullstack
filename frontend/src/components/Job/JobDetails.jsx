import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Get the token from local storage
        const token = localStorage.getItem("token");

        // Check if the token exists
        if (token) {
          // Log the 'token' value from local storage

          // Send the token to the backend along with the request
          const response = await axios.get(`https://kart-jobs-backend.onrender.com/api/v1/job/${id}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
            },
          });
          setJob(response.data.job);
        } else {
          // Handle the case when the token is not available
          navigateTo("/login");
        }
      } catch (error) {
        navigateTo("/notfound");
        toast.error(error.response.data.message);
      }
    };

    // Delay the execution of fetchJobDetails by 0.5 seconds
    const delayFetchJobDetails = setTimeout(() => {
      fetchJobDetails();
    }, 500);

    return () => clearTimeout(delayFetchJobDetails);
  }, [id]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span> {job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
