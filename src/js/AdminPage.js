import React from "react";

import Heading from "./components/common/Heading";

export const AdminPage = (props) => {
  return (
    <div className="Admin">
      <Heading hLevel={2} baseClass="Settings">
        Admin Page
      </Heading>
    </div>
  );
};

export default AdminPage;
