import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteEducation } from "../../action/profile";
import { connect } from "react-redux";

const Education = ({ education, deleteEducation }) => {
  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Year</th>
          </tr>
        </thead>
        <tbody>
          {education.map((education) => {
            return (
              <Fragment key={education._id}>
                <tr>
                  <td>{education.school}</td>
                  <td className="hide-sm">{education.degree}</td>
                  <td>
                    <Moment format="YYYY/MM/DD">{education.form}</Moment> -{" "}
                    {education.to === null ? (
                      "Now"
                    ) : (
                      <Moment format="YYYY/MM/DD">{education.to}</Moment>
                    )}
                  </td>
                  <td
                    className="btn btn-danger"
                    onClick={() => {
                      deleteEducation(education._id);
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

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
