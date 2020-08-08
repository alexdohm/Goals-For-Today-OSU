import momentTZ from "moment-timezone";

// Build Time Zone List
const timeZonesList = momentTZ.tz.names();
const allTimeZones = [];
timeZonesList.forEach(function (zone) {
  const item = { key: zone, value: zone, text: zone };
  allTimeZones.push(item);
});
export const TIME_LIST = allTimeZones;

//semantic ui icon names
export const ADD_ICON = "add";
export const EDIT_ICON = "edit";
export const GROUP_ICON = "group";
export const SETTING_ICON = "setting";
export const SIGN_OUT_ICON = "sign-out";
export const TRASH_ICON = "trash alternate";
export const USER_ICON = "user";
export const ADMIN_ICON = "user secret";
export const MENU_ICON = "bars";
export const CLOSE_ICON = "close";
export const COMMENT_ICON = "comment alternate outline";
export const PIE_CHART_ICON = "chart pie";

export const TIME_OPTIONS = [
  {
    text: "12:00 AM",
    value: "00:00",
    key: "00:00",
  },
  {
    text: "12:30 AM",
    value: "00:30",
    key: "00:30",
  },
  {
    text: "1:00 AM",
    value: "01:00",
    key: "01:00",
  },
  {
    text: "1:30 AM",
    value: "01:30",
    key: "01:30",
  },
  {
    text: "2:00 AM",
    value: "02:00",
    key: "02:00",
  },
  {
    text: "2:30 AM",
    value: "02:30",
    key: "02:30",
  },
  {
    text: "3:00 AM",
    value: "03:00",
    key: "03:00",
  },
  {
    text: "3:30 AM",
    value: "03:30",
    key: "03:30",
  },
  {
    text: "4:00 AM",
    value: "04:00",
    key: "04:00",
  },
  {
    text: "4:30 AM",
    value: "04:30",
    key: "04:30",
  },
  {
    text: "5:00 AM",
    value: "05:00",
    key: "05:00",
  },
  {
    text: "5:30 AM",
    value: "05:30",
    key: "05:30",
  },
  {
    text: "6:00 AM",
    value: "06:00",
    key: "06:00",
  },
  {
    text: "6:30 AM",
    value: "06:30",
    key: "06:30",
  },
  {
    text: "7:00 AM",
    value: "07:00",
    key: "07:00",
  },
  {
    text: "7:30 AM",
    value: "07:30",
    key: "07:30",
  },
  {
    text: "8:00 AM",
    value: "08:00",
    key: "08:00",
  },
  {
    text: "8:30 AM",
    value: "08:30",
    key: "08:030",
  },
  {
    text: "9:00 AM",
    value: "09:00",
    key: "09:00",
  },
  {
    text: "9:30 AM",
    value: "09:30",
    key: "09:30",
  },
  {
    text: "10:00 AM",
    value: "10:00",
    key: "10:00",
  },
  {
    text: "10:30 AM",
    value: "10:30",
    key: "10:30",
  },
  {
    text: "11:00 AM",
    value: "11:00",
    key: "11:00",
  },
  {
    text: "11:30 AM",
    value: "11:30",
    key: "11:30",
  },
  {
    text: "12:00 PM",
    value: "12:00",
    key: "12:00",
  },
  {
    text: "12:30 PM",
    value: "12:30",
    key: "12:30",
  },
  {
    text: "1:00 PM",
    value: "13:00",
    key: "13:00",
  },
  {
    text: "1:30 PM",
    value: "13:30",
    key: "13:30",
  },
  {
    text: "2:00 PM",
    value: "14:00",
    key: "14:00",
  },
  {
    text: "2:30 PM",
    value: "14:30",
    key: "14:30",
  },
  {
    text: "3:00 PM",
    value: "15:00",
    key: "15:00",
  },
  {
    text: "3:30 PM",
    value: "15:30",
    key: "15:30",
  },
  {
    text: "4:00 PM",
    value: "16:00",
    key: "16:00",
  },
  {
    text: "4:30 PM",
    value: "16:30",
    key: "16:30",
  },
  {
    text: "5:00 PM",
    value: "17:00",
    key: "17:00",
  },
  {
    text: "5:30 PM",
    value: "17:30",
    key: "17:30",
  },
  {
    text: "6:00 PM",
    value: "18:00",
    key: "18:00",
  },
  {
    text: "6:30 PM",
    value: "18:30",
    key: "18:30",
  },
  {
    text: "7:00 PM",
    value: "19:00",
    key: "19:00",
  },
  {
    text: "7:30 PM",
    value: "19:30",
    key: "19:30",
  },
  {
    text: "8:00 PM",
    value: "20:00",
    key: "20:00",
  },
  {
    text: "8:30 PM",
    value: "20:30",
    key: "20:30",
  },
  {
    text: "9:00 PM",
    value: "21:00",
    key: "21:00",
  },
  {
    text: "9:30 PM",
    value: "21:30",
    key: "21:30",
  },
  {
    text: "10:00 PM",
    value: "22:00",
    key: "22:00",
  },
  {
    text: "10:30 PM",
    value: "22:30",
    key: "22:30",
  },
  {
    text: "11:00 PM",
    value: "23:00",
    key: "23:00",
  },
  {
    text: "11:30 PM",
    value: "23:30",
    key: "23:30",
  },
];

export const COLORS = [
  "#FF6358",
  "#FFD246",
  "#78D237",
  "#28B4c8",
  "#2D73F5",
  "#AA46BE",
];
