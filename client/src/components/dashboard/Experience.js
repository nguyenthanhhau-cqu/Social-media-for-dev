import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../action/profile";
import { connect } from "react-redux";
const Experience = ({ experience, deleteExperience }) => {
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Year</th>
          </tr>
        </thead>
        <tbody>
          {experience.map((experience) => {
            return (
              <Fragment key={experience._id}>
                <tr>
                  <td>{experience.company}</td>
                  <td className="hide-sm">{experience.title}</td>
                  <td>
                    <Moment format="YYYY/MM/DD">{experience.form}</Moment> -{" "}
                    {experience.to === null ? (
                      "Now"
                    ) : (
                      <Moment format="YYYY/MM/DD">{experience.to}</Moment>
                    )}
                  </td>
                  <td
                    className="btn btn-danger"
                    onClick={() => {
                      deleteExperience(experience._id);
                    }}
                  >
                    {" "}
                    Delete
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
