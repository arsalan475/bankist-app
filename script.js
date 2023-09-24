'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDate: [
    'Sun Sep 17 2023',
    'Thu Sep 14 2023',
    'Tue Sep 12 2023',
    'Mon Sep 18 2023',
    'Wed Sep 13 2023',
    'Thu Sep 07 2023',
    'Tue Sep 19 2023',
    'Mon Sep 18 2023'],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDate: [
    'Tue Sep 19 2023',
    'Tue Sep 12 2023',
    'Mon Sep 11 2023',
    'Mon Sep 18 2023',
    'Wed Sep 13 2023',
    'Sun Sep 17 2023',
    'Tue Sep 19 2023',
    'Tue Sep 12 2023'],
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
const labelWelcome = document.querySelector('.user-greeting span.name');
const labelDate = document.querySelector('.curDate');
const labelBalance = document.querySelector('.amount-info h1.amount');
const labelSumIn = document.querySelector('.footer-left .in-box span');

const allMovemnts =document.querySelector(".all-info .account-info")
const labelSumOut = document.querySelector('.footer-left .out-box span');
const labelSumInterest = document.querySelector('.footer-left .interest-box span');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.main');
const containerMovements = document.querySelector('.account-info .trancation-history');

const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.transfer-input-box .func-btn');
const btnLoan = document.querySelector('.request-input-box .func-btn');
const btnClose = document.querySelector('.delete-acc-box .func-btn');
const btnSort = document.querySelector('.footer-left .sort-box span');

const inputLoginUsername = document.querySelector('.header .input-container #userName');
const inputLoginPin = document.querySelector('.header .input-container #password');
const inputTransferTo = document.querySelector('.transfer-input-box #transfer-to');
const inputTransferAmount = document.querySelector('.transfer-input-box #amount-transfer');
const inputLoanAmount = document.querySelector('.request-input-box #loan-amount');
const inputCloseUsername = document.querySelector('.delete-acc-box #close-user-name');
const inputClosePin = document.querySelector('.delete-acc-box #confirm-pin');


let currentUser;
let total;
let timmer;


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////




  function countDown() {
   let time = 60 * 10;
const tick = function () {
  let minutes = Math.trunc(time / 60)
  let sec = time % 60;

  if (time === 0) {
    clearInterval(timmer);
    containerApp.style.opacity = "0"
    labelWelcome.textContent = "Login to get account info";
  }
  time--

  labelTimer.textContent = `${minutes}:${String(sec).padStart(2, 0)}`;
}
    tick()
    timmer = setInterval(tick, 1000)
  
    return timmer;
  }





function updateUi(user,sort = false) {
  totalBalance(user)
  totalSumary(user)
  displayMomvements(user , sort)
}

btnLogin.addEventListener("click", function () {
  
   currentUser = accounts.find(user => user.userName === inputLoginUsername.value)
   
   if (currentUser && currentUser?.pin === +inputLoginPin.value) {
     displayUi(currentUser)
      
 if(timmer)  clearInterval(timmer)

  timmer = countDown();
  
     updateUi(currentUser)
     
   } else {
     containerApp.style.opacity = "0";
     alert('Invalid User Name or Password')
  }
   
   
   inputLoginUsername.value = inputLoginPin.value = ""
 })

let option = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second:'numeric'
}

function displayUi(user) {
  containerApp.style.opacity = "1"
  labelWelcome.textContent = `Good Afternoon ${user.owner}`;

  labelDate.textContent = new Intl.DateTimeFormat(navigator.language,option).format(new Date());
}

function totalBalance(user) {
 
  user.movements.reduce(function(acu,v) {
    total = acu + v
    return total
  }, 0)
  
  labelBalance.textContent = total
 
}

function totalSumary(user) {

  let sumaryIn;
  let sumaryOut;
 
  user.movements.filter(v => v > 0).reduce(function(acu,v) {
    sumaryIn = acu + v
    return sumaryIn
  }, 0)

  user.movements.filter(v => v < 0).reduce(function(acu,v) {
    sumaryOut = acu += v
    return sumaryOut
  }, 0)

  let interest = user.movements.filter(mov => mov >= 1).map(deposits => (deposits * user.interestRate) / 100).filter(int => int > 1).reduce((acu,cur) => acu + cur)

  labelSumIn.textContent = sumaryIn.toFixed(2);
  labelSumOut.textContent = Math.abs(sumaryOut).toFixed(2) || "0%";
  labelSumInterest.textContent = `${interest.toFixed(2)}%`

}


function formatDate(date1,date2) {
  let past = Math.trunc(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));

  if (past === 0) return 'Today';
  if (past === 1) return 'Yesterday';
  if (past > 1 && past < 7) return `${past} days ago`;
  if (past === 7) return '1 week ago'
  
return new Intl.DateTimeFormat(navigator.language).format(new Date(date1))

}




function displayMomvements(user,sort = false) {

  allMovemnts.innerHTML = ""
 
  let movs = sort ? user.movements.slice(0).sort((a, b) => a - b) : user.movements;
 
    
  movs.forEach((mov, i) => {
        let checkAmount = `${mov > 0? "deposit":"withDraw"}`
    allMovemnts.insertAdjacentHTML("afterbegin",  ` <div class="trancation-history">
    <div class="history-label">
      <h2 class="${checkAmount}">${checkAmount}</h2>
      <span>${ formatDate(user.movementsDate[i],new Date())
      }</span>
    </div>

    <h1>${Math.abs(mov).toFixed(2)}</h1>
  </div>`)
  });
}


function addUserNameToObject(acc) {
  let userName;

acc.forEach(acc =>{ 
  userName = acc.owner.split(" ").map((word) => {
    return word[0]
   }).join('').toLowerCase()
    
    acc.userName = userName;
  })
}


addUserNameToObject(accounts)

btnTransfer.addEventListener('click', function () {
  
  clearInterval(timmer)
  timmer = countDown;
  timmer()
  let accHolder = accounts.find(accHolder => accHolder.userName === inputTransferTo.value)
  

  if (inputTransferAmount.value > 0 && currentUser && currentUser.userName !== accHolder.userName && total >= +inputTransferAmount.value) {
    accHolder.movements.push(+inputTransferAmount.value)
    accHolder.movementsDate.push(new Date().toDateString())
    currentUser.movementsDate.push(new Date().toDateString())
    currentUser.movements.push(-inputTransferAmount.value)
   updateUi(currentUser)
    
  } 

  inputTransferTo.value = inputTransferAmount.value = '';
  
})


btnClose.addEventListener('click',function () {
  if (currentUser.userName === inputCloseUsername.value && currentUser.pin === +inputClosePin.value) {
    let index = accounts.findIndex(acc => acc.userName === inputCloseUsername.value)
  
    accounts.splice(index, 1)
    containerApp.style.opacity = '0';
    inputClosePin.value = inputCloseUsername.value = ""
  }
})


btnLoan.addEventListener('click', function () {
   
  clearInterval(timmer)
  timmer = countDown();
  let loanAmount = +inputLoanAmount.value;

  if (loanAmount > 0 && currentUser.movements.some(mov => mov > loanAmount / 10)) {
    currentUser.movements.push(loanAmount)
   
    currentUser.movementsDate.push(new Date().toDateString())
    updateUi(currentUser);
    inputLoanAmount.value=""
  } else {
    alert("Amount is to high for loan")
  }


})

let sorting = false;


btnSort.addEventListener('click', function () {
  updateUi(currentUser,!sorting)

  sorting = !sorting;
console.log(sorting)
  console.log("clicked")
})

