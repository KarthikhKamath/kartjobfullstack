import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get the token from local storage
        const token = localStorage.getItem("token");

        // Check if the token exists
        if (token) {
          // Log the 'token' value from local storage

          // Send the token to the backend along with the request
          const response = await axios.get("https://kart-jobs-backend.onrender.com/api/v1/job/getall", {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
            },
          });
          setJobs(response.data.jobs);
        } else {
          // Handle the case when the token is not available
          navigateTo("/");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    // Delay the execution of fetchJobs by 0.5 seconds
    const delayFetchJobs = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayFetchJobs);
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.map((element) => {
            return (
              <div className="card" key={element._id}>
                <p>{element.title}</p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
