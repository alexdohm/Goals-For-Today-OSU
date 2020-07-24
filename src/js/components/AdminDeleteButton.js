import React from 'react';
import { Button } from 'semantic-ui-react'

const AdminDeleteButton = (props) => {
  return (
    <Button negative type="button" className="Admin-deleteButton" onClick={props.onClick}>
      Delete Team
    </Button>
  )
}

export default AdminDeleteButton;