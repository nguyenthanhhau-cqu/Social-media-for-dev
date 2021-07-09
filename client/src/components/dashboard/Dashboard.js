import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../action/profile";
import Spinner from "../layout/Spinner";
import { DashboardAction } from "./dashboardAction";
import Experience from "./Experience";
import Education from "./Education";
import { deleteAccount } from "../../action/profile";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  profile: { profile, loading },
  auth: { user },
}) => {
  // eslint-disable-next-line
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardAction />
          <Experience experience={profile.experiences} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>No profile found, please add some information</p>
          <Link to="create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}

      <button
        onClick={() => {
          deleteAccount(user.id);
        }}
        className="btn btn-danger"
        style={{ marginTop: "50px" }}
      >
        Delete account
      </button>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
