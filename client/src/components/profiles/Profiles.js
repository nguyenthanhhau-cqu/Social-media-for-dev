import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfiles } from "../../action/profile";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((element) => (
                <ProfileItem key={element._id} Profile={element} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object,
  getProfiles: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
