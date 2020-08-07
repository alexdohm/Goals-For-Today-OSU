import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

import Heading from './common/Heading';


const UserStats = (props) => {

  const { userData } = props

  const data = buildData(userData);

  if (data) {
    return (
      <div className="UserStats">
        <Heading hLevel={3} baseClass="UserStats">
          {userData.first_name} {userData.last_name}
        </Heading>
        <PieChart
          data={data}
          lineWidth={25}
          label={({ dataEntry }) => dataEntry.value == 0.5 ? 0 : dataEntry.value}
          labelStyle={(index) => ({
            fill: data[index].color,
            fontSize: '16px',
          })}
          labelPosition={60}
          style={{ height: '200px' }}
          animate
          animationDuration={1000}
        />
      </div>
    );
  }
}

const buildData = (userData) => {
  if (!userData) {
    return null;
  }

  const red = '#CF0819';
  const green = '#3AE314';

  const total = userData.totalgoals || 0;
  let completed = userData.finishedgoals || 0;
  let incomplete = total - completed;
  if (completed == 0 && incomplete == 0) {
    completed = null;
    incomplete = 0.5; //can use as a flag since these will always be whole numbers in normal circumstances
  }

  return [
    { title: 'Complete', value: completed, color: green },
    { title: 'Incomplete', value: incomplete, color: red}
  ];
}

export default UserStats;
