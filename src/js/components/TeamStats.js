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

import Heading from "./common/Heading";
import { dateToAxisString, getRandomColor } from "./common/helpers";
import { COLORS } from "./common/constants";

const TeamStats = (props) => {
  const { teamCompletedInPeriod } = props;

  const dateToGoalsMap = {};
  const data = getData(teamCompletedInPeriod, dateToGoalsMap);
  const zeroData = getDataWithZeros(data, dateToGoalsMap, props.beginDate, props.endDate);

  if (data && data.length) {
    return (
      <div className="TeamStats">
        <Heading baseClass="TeamStats" hLevel={2}>
          Team Goal Completion Percentages
        </Heading>
        <div className="TeamStats">
          <ResponsiveContainer
            className="TeamStats-chart"
            height={400}
            width="100%"
          >
            <LineChart data={zeroData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percent" stroke={getColor(0)} strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
          <ResponsiveContainer
            className="TeamStats-chart"
            height={400}
            width="100%"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percent" fill={getColor(0)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
};

const getData = (teamCompletedInPeriod, dateToGoalsMap) => {
  const data = [];

  for (const item of teamCompletedInPeriod) {
    const dateString = dateToAxisString(new Date(item.goaldate));
    if (!dateToGoalsMap[dateString]) {
      dateToGoalsMap[dateString] = {
        total: 0,
        finished: 0,
      };
    }

    dateToGoalsMap[dateString].total += item.totalgoals || 0;
    dateToGoalsMap[dateString].finished += item.finishedgoals || 0;
  }

  for (const date in dateToGoalsMap) {
    const entry = {};
    entry["name"] = date;

    let percentage;
    if (dateToGoalsMap[date].total == 0) {
      percentage = 0.0;
    } else {
      percentage = Math.floor(
        (dateToGoalsMap[date].finished / dateToGoalsMap[date].total) * 100
      );
    }

    entry.percent = percentage;

    data.push(entry);
  }

  data.sort((a, b) => {
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);

    return aDate.getTime() - bDate.getTime();
  });

  return data;
};

const getDataWithZeros = (data, dateToGoalsMap, beginDate, endDate) => {

  //clone existing data to zeroData
  const zeroData = [];
  for (const entry of data) {
    zeroData.push(JSON.parse(JSON.stringify(entry)));
  }

  let date = new Date(beginDate.getTime());
  while (date.getTime() <= endDate.getTime()) {
    const dateString = dateToAxisString(date);
    if (!dateToGoalsMap[dateString]) {
      const zeroEntry = {};
      zeroEntry["percent"] = 0
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

const getColor = (index) => {
  if (index > COLORS.length) {
    return getRandomColor();
  } else {
    return COLORS[index];
  }
};

export default TeamStats;
