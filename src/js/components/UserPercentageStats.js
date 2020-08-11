import React from "react";
import {
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";

import { dateToAxisString, getRandomColor } from "./common/helpers";
import { COLORS } from "./common/constants";
import Heading from "./common/Heading";

const UserPercentageStats = (props) => {
  const { perMemberInPeriod } = props;
  const nameList = [];

  const dateToDataMap = {};
  const userIdToNameMap = {};
  const data = getData(perMemberInPeriod, nameList, dateToDataMap, userIdToNameMap);
  const dataWithZeros = getDataWithZeros(dateToDataMap, nameList, data, props.beginDate, props.endDate);

  if (data && data.length) {
    return (
      <div className="UserPercentageStats">
        <Heading hLevel={2} baseClass="UserPercentageStats">
          Goal Completion Percentage per User
        </Heading>
        <ResponsiveContainer
          className="UserPercentageStats-chart"
          height={400}
          width="100%"
        >
          <LineChart data={dataWithZeros}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {generateLines(nameList)}
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          className="UserPercentageStats-chart"
          height={400}
          width="100%"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {generateBars(nameList)}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return null;
  }
};

const getData = (perMemberInPeriod, nameList, dateToDataMap, userIdToNameMap) => {
  const data = [];

  for (const item of perMemberInPeriod) {
    if (!item.goaldate) {
      continue;
    }
    const dateString = dateToAxisString(new Date(item.goaldate));
    if (!dateToDataMap[dateString]) {
      dateToDataMap[dateString] = {};
    }

    const userId = item.member_id;
    if (!userIdToNameMap[userId]) {
      userIdToNameMap[userId] = item.first_name + " " + item.last_name;
    }

    let percentage;
    if (item.totalgoals == 0) {
      percentage = 0.0;
    } else {
      percentage = Math.floor((item.finishedgoals / item.totalgoals) * 100);
    }
    dateToDataMap[dateString][userId] = percentage;
  }

  for (const date in dateToDataMap) {
    const entry = {};
    entry["name"] = date;

    for (const userId in dateToDataMap[date]) {
      const name = userIdToNameMap[userId];
      entry[name] = dateToDataMap[date][userId];
    }

    data.push(entry);
  }

  data.sort((a, b) => {
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);

    return aDate.getTime() - bDate.getTime();
  });

  for (const id in userIdToNameMap) {
    nameList.push(userIdToNameMap[id]);
  }
  return data;
};

const getDataWithZeros = (dateToDataMap, nameList, data, beginDate, endDate) => {
  
  //clone existing data to zeroData
  const zeroData = [];
  for (const entry of data) {
    zeroData.push(JSON.parse(JSON.stringify(entry)));
  }

  let date = new Date(beginDate.getTime());
  while (date.getTime() <= endDate.getTime()) {
    const dateString = dateToAxisString(date);
    if (!dateToDataMap[dateString]) {
      const zeroEntry = {};
      for (const name of nameList) {
        zeroEntry[name] = 0;
      }
      zeroEntry["name"] = dateString;
      zeroData.push(zeroEntry);
    }
    date.setDate(date.getDate() + 1);
  }

  zeroData.sort((a, b) => {
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);

    return aDate.getTime() - bDate.getTime();
  });

  return zeroData;
}

const generateBars = (nameList) => {
  return nameList.map((name, index) => {
    return <Bar dataKey={name} fill={getColor(index)} />;
  });
};

const generateLines = (nameList) => {
  return nameList.map((name, index) => {
    return <Line type="monotone" dataKey={name} stroke={getColor(index)} strokeWidth={2} />;
  });
};

const getColor = (index) => {
  if (index > COLORS.length) {
    return getRandomColor();
  } else {
    return COLORS[index];
  }
};

export default UserPercentageStats;
