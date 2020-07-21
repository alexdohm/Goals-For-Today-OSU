import React from 'react';

import Heading from './components/common/Heading';

export const TeamOverviewPage = (props) => {
  return (
    <div className='TeamOverview'>
      <Heading hLevel={1} baseClass='TeamOverview'>
        {props.teamName ? props.teamName : 'Test Team Name'}
      </Heading>
      <div className='TeamOverview-stats'>
        TODO: place charts here
      </div>
    </div>
  );
};

export default TeamOverviewPage;
