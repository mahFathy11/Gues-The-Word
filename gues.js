let tries = document.querySelector(".main-game .tries");
let check = document.querySelector(".main-game .check input");
let hintCont = document.querySelector(".main-game .check .hint");
let hintNum = document.querySelector(".main-game .check .hint span");

let allowedHint = 2;
let triesNum = 6;
let words = [
  "School",
  "Science",
  "JavaScript",
  "Egypt",
  "Mahmoud",
  "World",
  "Upgrade",
];
let correctColor = "#F57C00";
let notPlaceColor = "#388E3C";
let wrongColor = "#37474F";
let letterArr = "qwertyuiopasdfghjklzxcvbnm".split("");

hintNum.textContent = allowedHint;

// add data to Page
let randWordArr = words[Math.floor(Math.random() * words.length)].split("");
function addTries(nums) {
  for (i = 0; i < nums; i++) {
    let tryContainer = document.createElement("div");
    tryContainer.className = "try";
    if (i == 0) {
      tryContainer.classList.add("active");
    }

    let tryText = document.createElement("span");
    tryText.append(document.createTextNode(`Try ${i + 1}`));

    let inputsContainer = document.createElement("ul");
    inputsContainer.className = "inputs";

    for (j = 0; j < randWordArr.length; j++) {
      let tryLi = document.createElement("li");
      let tryInput = document.createElement("input");
      tryInput.type = "text";
      tryLi.append(tryInput);
      inputsContainer.append(tryLi);
    }
    tryContainer.append(tryText, inputsContainer);
    tries.append(tryContainer);
  }
}
addTries(triesNum);
tries.querySelector(".try input").focus();

// i will depend on it to make sure that when clicking enter all input passed
let currentInput = 0;
// on input focus on next and change currentInput
function onInput() {
  let inputs = [...document.querySelectorAll(".try.active .inputs input")];
  inputs.forEach((ele, i) => {
    // to write only letter not special char and if it letter remove the old and add new one
    ele.onkeydown = (k) => {
      if (letterArr.includes(k.key) || k.key == "Backspace") {
        ele.value = "";
      } else {
        k.preventDefault();
      }
      if (k.key == "ArrowRight" && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
      if (k.key == "ArrowLeft" && i > 0) {
        inputs[i - 1].focus();
      }
      // to make enter click transport me to next input if current input is full
      if (k.key == "Enter" && ele.value.trim() != "") {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
        if (i == inputs.length - 1) {
          ele.blur();
        }
        // i will depend on it to know that all input is filled
        currentInput = i + 1;
      }
    };

    ele.oninput = () => {
      // to input one letter then transport to next one
      if (letterArr.includes(ele.value)) {
        if (i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
        if (i == inputs.length - 1) {
          ele.blur();
        }
        ele.value = ele.value.toUpperCase();
        ele.style.color = "black";
        currentInput = i + 1;
      }
    };
  });
}
onInput();

function checkClick() {
  check.onclick = () => {
    // console.log(randWordArr.join(""));
    let inputs = [...document.querySelectorAll(".try.active .inputs input")];

    let numCorrect = 0;
    inputs.forEach((e, i) => {
      e.style.color = "white";
      // i will depend on it to know if it is wrong
      let correct = false;
      // check if it correct and in place
      if (e.value == randWordArr[i].toLocaleUpperCase()) {
        e.style.backgroundColor = correctColor;
        correct = true;
        numCorrect++;
      } else {
        // check if it correct and not in place
        randWordArr.forEach((letter) => {
          if (letter.toLocaleUpperCase() == e.value) {
            e.style.backgroundColor = notPlaceColor;
            correct = true;
          }
          // still wrong
          if (!correct) {
            e.style.backgroundColor = wrongColor;
          }
        });
      }
    });

    let activeTry = document.querySelector(".try.active");
    function endGame() {
      check.classList.add("end");
      hintCont.classList.add("end");
      activeTry.classList.remove("active");
    }
    if (numCorrect < randWordArr.length) {
      // to prevent more click on check
      if ([...tries.children].indexOf(activeTry) == triesNum - 1) {
        endGame();
      }
      // to remove active from current try and add it to next one
      if ([...tries.children].indexOf(activeTry) < triesNum - 1) {
        activeTry.classList.remove("active");
        activeTry.nextElementSibling.classList.add("active");
        // focusing on first and active the onInput function on new active element
        activeTry.nextElementSibling.querySelector("input").focus();
        onInput();
      }
    }
    if (numCorrect == randWordArr.length) {
      endGame();
    }
  };
}
checkClick();

// to make enter click as check if all input filled
document.onkeydown = (k) => {
  if (k.key == "Enter" && currentInput == randWordArr.length) {
    check.click();
    currentInput = 0;
  }
};

// hinting
function hint() {
  let indexArr = [];
  randWordArr.forEach((e, i) => {
    indexArr.push(i);
  });

  let count = 0;
  hintCont.onclick = (e) => {
    if (count < randWordArr.length && count < allowedHint) {
      let myInputs = [
        ...document.querySelectorAll(".try.active .inputs input"),
      ];
      let randomIndex = indexArr[Math.floor(Math.random() * indexArr.length)];
      myInputs[randomIndex].value =
        randWordArr[randomIndex].toLocaleUpperCase();
      myInputs[randomIndex].style.color = correctColor;
      indexArr.splice(indexArr.indexOf(randomIndex), 1);

      hintNum.textContent = +hintNum.textContent - 1;
      count++;
    }
    if (count == allowedHint || count == randWordArr.length) {
      hintCont.classList.add("end");
      hintNum.textContent = 0;
    }
  };
}
hint();
