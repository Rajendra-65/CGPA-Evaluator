// To get a element from html dom

function call(name) {
  return document.querySelector(name);
}

// To get elements from html dom
function callAll(name) {
  return document.querySelectorAll(name);
}

// Selecting various elements from the DOM
const addInputBtn = call(".add");
const calculateBtn = call(".calculate");
const addNewSecBtn = call(".addNewSecBtn");
const addNewSecInp = call(".addNewSecInp");
const yesBtn = call(".yesBtn");
const noBtn = call(".noBtn");
const submitBtn = call(".submitBtn");
const addInput = call(".numAdd");
const uName = call("#name");
const years = call("#years");
const regNum = call("#registration")
const undo = call(".undo");
const grades = callAll(".grade");
let totalUnit = call(".totalUnit");
let gpaValue = call(".gpaScore");
const level = call(".level");
const semester = call(".semester");
let displayResult = call(".displayResult");
let cgpaScore = call(".cgpaScore");
let displayBg = call(".modalResult-bg");
let helpBtn = document.querySelector(".help");
let modal = document.getElementById("modal");
let closeBtn = document.querySelector(".cancelBtn");
const userForm = document.getElementById('#userForm');

var levelCount = 1;
let semLevel=1
let cgpaArray = [];
let clickedYesBtn = false;
let clickedUndoBtn = false;
let clickedCalcBtn = false;
semester.innerHTML=semLevel
document.addEventListener("keydown", e => {
  if (e.key === "Enter") addNewInput();
});
addInputBtn.addEventListener("click", addNewInput);
calculateBtn.addEventListener("click", gpaResult);
yesBtn.addEventListener("click", continueCalculation);
noBtn.addEventListener("click", stopCalculation);
submitBtn.addEventListener("click", formSubmit);
undo.addEventListener("click", undoCgpaArray);
helpBtn.addEventListener("click", () => (modal.style.display = "block"));
closeBtn.addEventListener("click", () => (modal.style.display = "none"));

// When Undo button is clicked, pop the last item from the arrayconst userForm = document.getElementById('userForm');
function undoCgpaArray() {
  if (!clickedUndoBtn) {
    addInput.focus();
    addInput.select();

    grades.forEach(grade => {
      grade.value = "";
    });

    totalUnit.innerHTML = 0;
    gpaValue.innerHTML = 0;

    cgpaArray.pop();

    clickedUndoBtn = true;
    clickedCalcBtn = false;

    cgpaScore.innerHTML = cgpaCal(cgpaArray);

    console.log(cgpaArray);
  }
}

// Calculate for the next semester
function continueCalculation() {
  if (!clickedYesBtn) {
    addInput.focus();
    addInput.select();

    grades.forEach(grade => {
      grade.value = "";
    });
    semLevel+=1
    totalUnit.innerHTML = 0;
    gpaValue.innerHTML = 0;
    semester.innerHTML=semLevel

    clickedYesBtn = true;
    clickedCalcBtn = false;

    console.log(clickedYesBtn);
  }
}

// Forecast Result when no button is clicked
function stopCalculation() {
  let firstClass = averageGPA(years.value, 4.52);
  let content = `
    <div class="display__result__content">
      <h3>${firstUpper(userName.value)} you're on a ${
    years.value
  } years program</h3>
      <p><strong>${cgpaCal(cgpaArray)}</strong> is your current CGPA score</p>

      <small><em>Note: The average score is approximated</em></small>

      <div>
        ${
          firstClass > 6.5
            ? ""
            : `<p>You'll need <strong>${firstClass}</strong> to remain at <strong>1st class</strong> for each of the semesters left</p>`
        }

        <p>You'll need <strong>${averageGPA(
          years.value,
          3.52
        )}</strong> to remain at with a <strong>2nd class upper</strong> for each of the semesters left</p>

        <p>You'll need <strong>${averageGPA(
          years.value,
          2.52
        )}</strong> to remain at with a <strong>2nd class lower</strong> for each of the semesters left</p>
        
      </div>

      <button class="closeBtn">Close</button>
    </div>
    
  `;
  displayBg.style.display = "flex";
  displayResult.style.display = "flex";
  displayResult.innerHTML = content;

  let closeBtn = call(".closeBtn");

  closeBtn.addEventListener("click", () => {
    displayBg.style.display = "none";
    displayResult.style.display = "none";
  });
}

// When form is submitted
async function  formSubmit(e) {
  const formError = call("#formError");
  const modalBg = call(".modal-bg");
  let messages = [];

  addInput.focus();
  addInput.select();
  if (uName.value === "" || uName.value == null) {
    messages.push("Name is required");
  }

  if (years.value === "" || years.value == null) {
    messages.push("Years of program is required");
  }
  if(regNum.value === "" || regNum.value==null){
    messages.push("Registration Number is Required please Fill")
  }
  if (messages.length > 0) {
    formError.innerText = messages.join(", ");
  } else {
    e.preventDefault();
    modalBg.style.display = "none";
  }
      // Assuming you're using the Fetch API for the POST request
  const userName = uName.value
  const registration = regNum.value
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      mode: "cors",

      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        registration: registration,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer",

    });
  
    if (!response.ok) {
      console.log(response);
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
// Make name first Letter uppercase
function firstUpper(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Function to calculate the gpa score
function gpaResult() {
  let grades = callAll(".grade");
  let totalUnit = call(".totalUnit");
  let gpaValue = call(".gpaScore");
  let error = call(".error");

  let resultContinue = call(".resultContinue");

  let arrGrade = [];

  if (!clickedCalcBtn) {
    grades.forEach(grade => {
      if (grade.value !== "") {
        arrGrade.push(gradeToPoints(grade.value));
      }
    });

    // Output is stored as sumGPA
    let sumGPA = arrGrade.reduce((r, a, i) => {
      return r + a;
    }, 0);

    // totalUnit has the total summed credit
    totalUnit.innerHTML = arrGrade.length;

    gpaValue.innerHTML =
      (sumGPA / arrGrade.length).toFixed(2) === "NaN"
        ? disErr()
        : (sumGPA / arrGrade.length).toFixed(2);

    let scoreValue = (sumGPA / arrGrade.length).toFixed(2);

    cgpaArray.push(scoreValue);

    cgpaScore.innerHTML = cgpaCal(cgpaArray);

    function disErr() {
      // Error displays immediately
      setTimeout(() => {
        error.style.display = "block";
      }, 0);

      // at 5s error message disappears
      setTimeout(() => {
        error.style.display = "none";
      }, 5000);

      return 0;
    }

    if ((sumGPA / arrGrade.length).toFixed(2) !== "NaN") {
      resultContinue.style.display = "block";
    }

    clickedCalcBtn = true;

    clickedYesBtn = false;
    clickedUndoBtn = false;
  }

  // console.log(cgpaArray);
}

// Calculate the cgpa
function cgpaCal(cgpaArr) {
  let sum = cgpaArr.reduce((a, b) => Number(a) + Number(b));
  return (sum / cgpaArr.length).toFixed(2);
}

// Calculate the average score
function averageGPA(years, score) {
  let gpaNext;

  const extract = cgpaArray.reduce((a, b) => {
    a.push(score - b);
    return a;
  }, []);
  const extractSum = extract.reduce((a, b) => a + b);

  function getAverage() {
    let average;

    average = extractSum / (yearsProgram(years) - cgpaArray.length) + score;

    if (average < 0) {
      return 0;
    }

    return average.toFixed(2);
  }

  gpaNext = getAverage();

  return gpaNext;
}

// Function to add new inputs to the page
function addNewInput() {
  const displayOutput = call(".display__output"); // selecting the table body
  const addInput = call(".numAdd").value; // indicating the number of rows to be added

  // A function to add rows which takes a parameter
  function addRow(num) {
    let str = `
      <div class="display__output__container">
        <input type="text" name="courseCode" class="courseCode" placeholder="e.g. Course 1" />
    
        <select class="grade">
          <option value="O">O</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
      </div>
    `;

    // If the parameter is null or there's nothing ""
    // the process should just return the str variable
    if (num === "") return str;

    // This is to make the str (string) variable repeat
    // at a certain amount of time based on the argument passed
    return str.repeat(num);
  }

  // Function invoked
  displayOutput.innerHTML = addRow(addInput);
}

// Grade value to points
function gradeToPoints(grade) {
  switch (grade) {
    case "O":
      return 10;
      break;
    case "A+":
      return 9;
      break;
    case "A":
      return 8;
      break;
    case "B+":
      return 7;
      break;
    case "B":
      return 6;
      break;
    case "C":
      return 5;
      break;
    case "D":
      return 4;
      break;
    default:
      return undefined;
  }
}

function yearsProgram(years) {
  switch (years) {
    case "1":
      return 2;
      break;
    case "2":
      return 4;
      break;
    case "3":
      return 6;
      break;
    case "4":
      return 8;
      break;
    case "5":
      return 10;
      break;
    case "6":
      return 12;
      break;
    default:
      return undefined;
  }
}


