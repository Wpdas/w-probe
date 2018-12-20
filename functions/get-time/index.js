module.exports = () => {
  const currentDate = new Date();
  return `${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}`;
};
