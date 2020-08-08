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
  const data = getData(teamCompletedInPeriod);

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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percent" stroke={getColor(0)} />
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

const getData = (teamCompletedInPeriod) => {
  const data = [];

  const dateToGoalsMap = {};

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

  return data;
};

const getColor = (index) => {
  if (index > COLORS.length) {
    return getRandomColor();
  } else {
    return COLORS[index];
  }
};

export default TeamStats;
