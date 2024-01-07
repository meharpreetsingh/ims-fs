import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import styles from "../styles/chooseUser.module.scss";

const ChooseUser = () => {
  const navigate = useNavigate();
  const { status, currentUser, currentRole } = useSelector((state) => state.user);

  const navigateHandler = (user) => {
    if (user === "Admin") {
      navigate("/Adminlogin");
    } else if (user === "Student") {
      navigate("/Studentlogin");
    } else if (user === "Teacher") {
      navigate("/Teacherlogin");
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "error") {
      // Error message functionality
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Login/Signup</h1>
        <div className={styles["btn-container"]}>
          <button
            onClick={() => navigateHandler("Admin")}
            className={`${styles["custom-btn"]} ${styles["btn-3"]}`}
          >
            <span>Admin</span>
          </button>
          <button
            onClick={() => navigateHandler("Teacher")}
            className={`${styles["custom-btn"]} ${styles["btn-3"]}`}
          >
            <span>Teacher</span>
          </button>
          <button
            onClick={() => navigateHandler("Student")}
            className={`${styles["custom-btn"]} ${styles["btn-3"]}`}
          >
            <span>Student</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseUser;
