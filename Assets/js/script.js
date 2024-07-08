const taskTitleEl = $("#taskTitle");
const dueDateEl = $("#dueDate");
const taskDescriptionEl = $("#taskDescription");
const addTaskEl = $("#form-submit");

// Retrieve tasks and nextId from localStorage
function pullStoredData() {
    let taskList = JSON.parse(localStorage.getItem("tasks"));

    if (!taskList) {
        taskList = [];
    }
    return taskList;
}

// let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskID = {
        id: crypto.randomUUID(),
    }
    return taskID.id
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('task-id', task.taskID);
    const cardTaskName = $('<div>').addClass('task-header h4').text(task.name);
    const cardTaskBody = $('<div>').addClass('task-body');
    const cardTaskDate = $('<p>').addClass('task-text').text(task.dueDate);
    const cardTaskDescription = $('<p>').addClass('task-description)').text(task.description)
    const cardTaskDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('task-id', task.taskID);
    cardTaskDeleteBtn.on('click', handleDeleteTask)


    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'yyyy-MM-dd')
    if (task.taskStatus === 'done') { } else
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardTaskDeleteBtn.addClass('border-light')
        }

    cardTaskBody.append(cardTaskDescription, cardTaskDate, cardTaskDeleteBtn);
    taskCard.append(cardTaskName, cardTaskBody)

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let taskList = pullStoredData();

    const todoList = $("#todo-cards")
    todoList.empty();
    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();
    const doneList = $("#done-cards");
    doneList.empty();

    for (let task of taskList) {
        if (task.taskStatus === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.taskStatus === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.taskStatus === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    $(".draggable").draggable({
        opacity: 0.7, zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        }
    })
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskName = taskTitleEl.val().trim();
    const dueDate = dueDateEl.val();
    const description = taskDescriptionEl.val().trim();
    const newTask = {
        taskID: generateTaskId(),
        name: taskName,
        dueDate: dueDate,
        description: description,
        taskStatus: 'to-do',
    }

    let taskList = pullStoredData()
    taskList.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();

    taskTitleEl.val('')
    dueDateEl.val('');
    taskDescriptionEl.val('')
}
// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskListId = $(this).attr('task-id');
    const storedData = pullStoredData();

    storedData.forEach((task, index) => {
        if (taskListId === task.taskID) {
            storedData.splice(index, 1);
        }
    })

    localStorage.setItem('tasks', JSON.stringify(storedData));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let storedData = pullStoredData();
    console.log(storedData)
    const currentTaskID = ui.draggable[0].attributes[1].value
    console.log(currentTaskID);
    const newStatus = event.target.id;
    console.log(newStatus)

    for (let task of storedData) {
        if (task.taskID === currentTaskID) {
            task.taskStatus = newStatus
        }
    }

    localStorage.setItem('tasks', JSON.stringify(storedData));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();


    addTaskEl.on('click', handleAddTask);

    $('#dueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });


    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });



});
