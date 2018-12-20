module.exports = () => {
  const currentDate = new Date();
  return `${currentDate.getMonth() +
    1}_${currentDate.getDate()}_${currentDate.getFullYear()}`;
};
