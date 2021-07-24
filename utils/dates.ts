import dayjs from "dayjs";

function formatDate(string: string) {
  return string.replace(/^\s|\s/g, "/");
}

const formattedDayjs = (date: Date) => dayjs(date).format("DD.MM.YYYY");


export { formatDate, formattedDayjs };
