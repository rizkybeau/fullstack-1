console.log('hello');
// const USER_MAP = {
//   1: { name: 'kyle' },
//   2: { name: 'sally' },
// };
// const userMap = new Map([
//   [1, { name: 'kyle' }],
//   [2, { name: 'sally' }],
// ]);
// userMap.set({ userId: 1 }, { name: 'john' });
// console.log(userMap);
// console.log(USER_MAP);
//--endmap

const getPromises = () => {
  return new Promise((resolve) => {
    console.log('promise executed!');
    setTimeout(() => {
      resolve(Date.now()), 500;
    });
  });
};
const fromPromises = from(getPromises());
