const taskTitleEl = $("#taskTitle");
const dueDateEl = $("#dueDate");
const taskDescriptionEl = $("#taskDescription");
const addTaskEl = $("#form-submit");

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskID = {
        id: crypto.randomUUID(),
    }
    return taskID.id
}

// Todo: create a function to create a task card
function createTaskCard(taskList) {
    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('task-id', taskList.taskID);
    const cardTaskName = $('<div>').addClass('task-header h4').text(taskList.name);
    const cardTaskBody = $('<div>').addClass('task-body');
    const cardTaskDate = $('<p>').addClass('task-text').text(taskList.dueDate);
    const cardTaskDescription = $('<p>').addClass('task-description)').text(taskList.description)
    const cardTaskDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('task-id', taskList.id);

    cardTaskBody.append(cardTaskDescription, cardTaskDate, cardTaskDeleteBtn);
    taskCard.append(cardTaskName, cardTaskBody)

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (!taskList) {
        taskList = [];
        return taskList;
    }

    const todoList = $("#todo-cards")
    const inProgressList = $("#in-progress-cards");
    const doneList = $("#done-cards");

    for (let task of taskList) {
        if (taskList.taskStatus === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (taskList.taskStatus === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (taskList.taskStatus === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    // $("#draggable3").draggable({
    //     cursor: "move",
    //     cursorAt: { top: -12, left: -20 },
    //     helper: "clone"
    // })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskName = taskTitleEl.val().trim();
    const dueDate = dueDateEl.val();
    const description = taskDescriptionEl.val().trim();
    const newTask = {
        name: taskName,
        dueDate: dueDate,
        description: description,
        taskStatus: 'to-do',
        taskID: generateTaskId(),
    }

    console.log(newTask);

    renderTaskList();
    taskList.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();
}



// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});

addTaskEl.on('click', handleAddTask);