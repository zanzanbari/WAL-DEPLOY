import dayjs from "dayjs";
import "dayjs/locale/ko";

const getCurrentTime = () => {
  const setTime = new Date();
  const current = new Date(
    Date.UTC(
      setTime.getFullYear(),
      setTime.getMonth(),
      setTime.getDate(),
      setTime.getHours() - 9,
      setTime.getMinutes(),
      setTime.getSeconds(),
      setTime.getMilliseconds()
    ));
  return current;
}

const getCurrentDate = () => {
  return toStringByFormatting(new Date());
}


const getMorning = () => {
  const setTime = new Date();
  const morning = new Date(
    Date.UTC(
      setTime.getFullYear(),
      setTime.getMonth(),
      setTime.getDate(),
      8 - 9,
      0,
      0,
      0
    ));
  return morning;
}

const getAfternoon = () => {
  const setTime = new Date();
  const afternoon = new Date(
    Date.UTC(
      setTime.getFullYear(),
      setTime.getMonth(),
      setTime.getDate(),
      14 - 9,
      0,
      0,
      0
    ));
  return afternoon;
}

const getNight = () => {
  const setTime = new Date();
  const night = new Date(
    Date.UTC(
      setTime.getFullYear(),
      setTime.getMonth(),
      setTime.getDate(),
      20 - 9,
      0,
      0,
      0
    ));
  return night;
}

const setKoreaTime = (time: Date) => {
  const kHours = time.getHours() + 9;
  const setTime = new Date();
  const KoreaTime = new Date(
      setTime.getFullYear(),
      setTime.getMonth(),
      setTime.getDate(),
      kHours,
      0,
      0,
      0
  );
  return KoreaTime;
}

const toUtcTime = (date: Date) => {
  const utcTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() + 9,
    date.getMinutes(),
    0,
    0
  );
  return utcTime;
}

function leftPad(value) {
  if (value >= 10) {
      return value;
  }

  return `0${value}`;
}

function toStringByFormatting(source, delimiter = '-') {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

const timeHandler = {
  getCurrentTime,
  getCurrentDate,
  getMorning,
  getAfternoon,
  getNight,
  setKoreaTime,
  toUtcTime
};

export default timeHandler;