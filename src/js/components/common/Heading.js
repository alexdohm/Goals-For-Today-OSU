import React from "react";
import PropTypes from "prop-types";

const Heading = (props) => {
  let Tag;
  if (props.hLevel > 0 && props.hLevel < 7) {
    Tag = "h" + props.hLevel;
  } else {
    Tag = "h4";
  }

  const classes =
    props.baseClass +
    "-heading" +
    (props.modifier ? " " + props.baseClass + "-" + props.modifier : "");

  return (
    <Tag className={classes} onClick={props.onClick ? props.onClick : () => {}}>
      {props.children}
    </Tag>
  );
};

Heading.propTypes = {
  hLevel: PropTypes.number,
  children: PropTypes.string.isRequired,
  baseClass: PropTypes.string.isRequired,
};

export default Heading;
