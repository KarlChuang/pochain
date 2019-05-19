export const toLocalDateString = (timestamp) => {
  const date = new Date(timestamp);
  let timestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `;
  timestr += `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return timestr;
};
