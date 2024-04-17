'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //copy of movement array
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movements.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
    <div class="movements__value">${mov}€</div>
  
  </div>
    
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

let updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcAndPrintBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
let deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

let depositsFor = [];

for (let mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

console.log(movements);
let withdrawal = movements.filter(mov => mov < 0);
console.log(withdrawal);

let calcAndPrintBalance = function (acc) {
  let balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${balance} €`;

  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${balance} €`;
};

let euroToUsd = 1.1;
//pipline

let calcDisplaySummary = function (account) {
  let incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  let outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  // let interestRatio = account.movements;
  let interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((mov, i, arr) => {
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

let totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

let totalWithdrawalUSD = movements
  .filter(mov => mov < 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//event handelers
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  //prevent form from submitting
  event.preventDefault();
  //if no element matches this condition will make an error||undifined
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display ui & welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciverAcc &&
    reciverAcc?.username !== currentAccount.username
  )
    inputTransferAmount.value = inputTransferTo.value = '';
  {
    //doing the trancfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  let movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    ele => Number(ele.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// let anyDeposits = movements.some(mov => mov > 1500);
// let equalityDeposits = movements.some(mov => mov === -130);

// console.log(anyDeposits);
// console.log(equalityDeposits);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// //chaining
// //slice method
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -1));
// console.log(arr.slice());
// console.log([...arr]);
// //splice method change the original array
// //delete all the exteracted parts
// //second  parameter is the delete count
// console.log(arr.splice(1, 2));

// //reverse methode
// let arr2 = ['j', 'i', 'h', 'g', 'f'];
// //reverse the original array
// //mutate the original array
// console.log(arr2.reverse());
// console.log(arr2);

// //concat
// let letters = arr.concat(arr2);
// console.log(letters);
// console.log();

// //join

// console.log(letters.join(' _ '));

// let arr3 = [23, 11, 64];
// console.log(arr3.at(0));
// console.log(arr3[arr3.length - 1]);
// console.log(arr3.at(-1));
// console.log(arr3.slice(-1)[0]); //convert to int
// for (let movement of movements) {
//   if (movement > 0) {
//     console.log(`you deposited ${movement}`);
//   } else {
//     console.log(`you withdrew ${Math.abs(movement)}`);
//   }
// };
// console.log("--------------------------- forEach ----------------------------------");
// movements.forEach(movement){
//   if (movement > 0) {
//     console.log(`you deposited ${movement}`);
//   } else {
//     console.log(`you withdrew ${Math.abs(movement)}`);
//   }
// }

// for (let [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1} you deposited ${movement}`);
//   } else {
//     console.log(`movement ${i + 1} you withdrew ${Math.abs(movement)}`);
//   }
// }

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`movement ${i + 1} you deposited ${mov}`);
//   } else {
//     console.log(`movement ${i + 1} you withdrew ${Math.abs(mov)}`);
//   }
// });
// movements.forEach(function (mov, i) {
//   if (mov > 0) {
//     console.log(`movement ${i} you deposited ${mov}`);
//   } else {
//     console.log(`movement ${i} you withdrew ${Math.abs(mov)}`);
//   }
// });
//map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// let currenciesUnique = new Set(['usd', 'gbp', 'usd', 'eur']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// function checkDogs(dogsJulia, dogsKate) {
//   let juliaCopy = dogsJulia.slice();
//   juliaCopy.splice(0, 1);
//   juliaCopy.splice(-2);
//   // dogsJulia.slice(1,3);
//   // console.log(juliaCopy);
//   let dogs = dogsJulia.concat(dogsKate);
//   console.log(dogs);
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`dog with number ${i + 1} is adult`);
//     } else {
//       console.log(`dog with number ${i + 1} is puppy`);
//     }
//   });
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// let euroToUsd = 1.1;
// //each iteration
// let movementUsd = movements.map(mov => mov * euroToUsd);
// let movmentUsd1 = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// let positiveMovement = movements.filter(function (mov) {
//   if (mov > 0) {
//     return mov;
//   }
// });
// console.log(positiveMovement);

// console.log(movementUsd);
// console.log(movmentUsd1);
// console.log(movements);
// console.log(movementUsd);
// console.log('******************************************* ');
// let movementUsdFor = [];
// for (let mov of movements) {
//   movementUsdFor.push(mov * euroToUsd);
// }
// console.log(movementUsdFor);

// let movementDescription = movements.map((mov, i) => {
//   `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//     mov
//   )}`;

//   // if (mov > 0) {
//   //   return `movement ${i} you deposited ${mov}`;
//   // } else {
//   //   return `movement ${i} you withdrew ${Math.abs(mov)}`;
//   // }
// });
// console.log(movementDescription);
// let balance = movements.reduce(function (acc, current, i, arr) {
//   console.log(`iteration ${i} : ${acc}`);
//   return acc + current;
// }, 0);
// console.log(balance);
// let balance = movements.reduce((acc, current) => (acc += current), 0);
// console.log(balance);

// //max value
// let max = movements.reduce(function (acc, current) {
//   if (acc > current) {
//     return acc;
//   } else {
//     return current;
//   }
// }, movements[0]);
// console.log(max);

// let balance2 = 0;
// let i = 0;
// for (let mov of movements) {
//   console.log(`iteration ${i} : ${balance2}`);
//   balance2 += mov;
//   i++;
// }
// console.log(balance2);

// let calcAverageHumanAge = function (Ages) {
//   let HumanAges = Ages.map(Age => (Age <= 2 ? 2 * Age : 16 + Age * 4));
//   let adults = HumanAges.filter(age => age >= 18);
//   console.log(HumanAges);
//   console.log(adults);
//   let average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   return average;
// };
// let average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// let average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(average1, average2);

// let calcAverageHumanAge = Ages =>
//   Ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// console.log(accounts);
// let account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for (let acc of accounts) {
//   console.log(accounts.find(acc => acc.owner === 'Jessica Davis'));
// }
// //every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// let accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// let allMovements = accountMovements.flat();
// console.log(allMovements);
// let overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);
//flat
// let overAllBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// //flatMap
// let overAllBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance2);

// let owners = ['ali', 'ahmed', 'mohamed', 'ibrahim'];

// //mutate the original array
// console.log(owners.sort());
// console.log(owners);
// console.log(movements);
//based on strings wrong result
//how to sort accourding to numeric number
//ascending order
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) {
//       return 1;
//     }
//     if (b > a) {
//       return -1;
//     }
//   })
// );
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) {
//       return -1;
//     }
//     if (b > a) {
//       return 1;
//     }
//   })
// );
// console.log(movements.sort((a, b) => b - a));
//fill mutate the original array
// let arr = [1, 2, 3, 4, 5, 6, 7];
// //empty array with fill method
// let x = new Array(7);
// x.fill(5, 3);
// console.log(x);

// arr.fill(23, 3, 6);
// console.log(arr);

// //[1,2,3,4,5,6,7]
// console.log(Array.from({ length: 7 }, (_, i) => i + 1));
// let xyz = Array.from({ length: 100 }, (_, i) => Math.round(Math.random() * 7));
// console.log(xyz);

//array exercise

//E1:X calculate how much deposit sum

//use flat
// let bankDepositSum = accounts
//   .map(acc => acc.movements)
//   .flat()
// .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);

//use flat map
// let bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

//EX2:how many deposits in the bank with at least 1000$

// let numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// let numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, curr) => (curr >= 1000 ? count+1 : count), 0);
// console.log(numDeposit1000);

//EX3: create new object contain the sum of deposits and withdrawl
// let sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, curr) => {
//       curr > 0 ? (sums.deposits += curr) : (sums.withdrawal += curr);
//       return sums;
//     },
//     { deposits: 0, withdrawal: 0 }
//   );
// console.log(sums);

//EX4: convert small case to capital case in some of them

// let convertTitleCase = function (title) {
//   let exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   let titleCase = title;
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a long title but not too long'));
// console.log(convertTitleCase('and here is another title with example'));

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

let dogSara = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(dogSara);
console.log(
  `sara's dog is eating  ${
    dogSara.curFood > dogSara.recFood ? 'much' : 'little'
  } `
);

let ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);

let ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4
console.log(`${ownersEatTooMuch.join('and')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.join('and')} dogs eat too little!`);

console.log(dogs.some(dog => dog.curFood === dog.recFood));
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
let checkEatingOK = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(checkEatingOK));
console.log(dogs.filter(checkEatingOK));

//8

let dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
