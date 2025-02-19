let goalArray = new Array(3).fill({ text: "", status: false });

// Retrieve goals from local storage
let retrievedGoals = JSON.parse(localStorage.getItem("goals"));

if (retrievedGoals) {
  goalArray = retrievedGoals;
}

let taskCompleted = goalArray.filter(goal => goal.status).length; // Count completed goals

const progressBar = document.querySelector("progress");
progressBar.value = (taskCompleted / 3) * 100;
const progressBarText = document.querySelector(".progress-text");
progressBarText.textContent = `${taskCompleted}/3 completed`;

const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const goals = document.querySelectorAll('input[type="text"]');

const saveToLocalStorage = (goalArray) => {
  localStorage.setItem("goals", JSON.stringify(goalArray));
};

const isGoalEmpty = () => {
  return goalArray.some((goal) => goal.text.trim() === "");
};

// Populate inputs and checkboxes on page load
goals.forEach((goal, index) => {
  goal.value = goalArray[index].text; 
});

checkBoxes.forEach((checkbox, index) => {
  checkbox.checked = goalArray[index].status;
});

// Attach event listener to text inputs
goals.forEach((goal, index) => {
  goal.addEventListener("blur", (e) => {
    let warning = document.querySelector(".warning");
    if (warning) {
      warning.remove();
    }
    let goalText = e.target.value.trim();
    if (goalText !== "") {
      goalArray[index] = { text: goalText, status: goalArray[index].status };
      saveToLocalStorage(goalArray);
    }
  });
});

// Attach event listener to checkboxes
checkBoxes.forEach((checkbox, index) => {
  checkbox.addEventListener("change", () => {
    if (isGoalEmpty()) {
      checkbox.checked = false;
      let warning = document.querySelector(".warning");
      warning.style.display = "block";
      warning.textContent = "Please fill all the goals first";
      return;
    }

    if (checkbox.checked) {
      if (!goalArray[index].status) {
        taskCompleted++;
        goalArray[index].status = true;
      }
    } else {
      if (goalArray[index].status) {
        taskCompleted--;
        goalArray[index].status = false;
      }
    }

    saveToLocalStorage(goalArray); // Save updated checkbox state
    progressBar.value = (taskCompleted / 3) * 100;
    if (taskCompleted === 3) {
      localStorage.clear();
    }

    progressBarText.textContent = `${taskCompleted}/3 completed`;
  });
});
