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
          label={({ dataEntry }) => dataEntry.value}
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

  const total = userData.totalgoals;
  const completed = userData.finishedgoals;
  const incomplete = total - completed;

  return [
    { title: 'Complete', value: completed, color: green },
    { title: 'Incomplete', value: incomplete, color: red}
  ];
}

export default UserStats;
