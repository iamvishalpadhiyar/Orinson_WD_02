document.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.getElementById('inputbox');
  const addTaskButton = document.getElementById('addtask');
  const taskList = document.querySelector('.tasklist');

  function fetchTasks() {
    fetch('/view')
      .then(response => response.json())
      .then(tasks => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
          createTaskElement(task._id, task.taskName, task.completed);
        });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }

  function createTaskElement(id, taskName, completed) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    if (completed) {
      taskDiv.classList.add('complete');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
      markTaskComplete(id, checkbox.checked);
    });

    const taskNameElement = document.createElement('span');
    taskNameElement.textContent = taskName;
    taskNameElement.classList.add('task-name');
    if (completed) {
      taskNameElement.style.textDecoration = 'line-through';
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-task');
    editButton.addEventListener('click', () => {
      const newTaskValue = prompt('Edit your task:', taskName);
      if (newTaskValue !== null && newTaskValue.trim() !== '') {
        editTask(id, newTaskValue);
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-task');
    deleteButton.addEventListener('click', () => {
      deleteTask(id);
    });

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskNameElement);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);
    taskList.appendChild(taskDiv);
  }

  function addTask() {
    const taskValue = inputBox.value.trim();
    if (taskValue === '') {
      alert('Please enter a task');
      return;
    }

    fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName: taskValue }),
    })
      .then(() => {
        fetchTasks(); 
      })
      .catch(error => console.error('Error adding task:', error));

    inputBox.value = '';
  }

  function markTaskComplete(id, completed) {
    fetch(`/complete/${id}`, {
      method: 'PUT',
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error marking task as complete:', error));
  }

  function editTask(id, newTaskName) {
    fetch(`/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName: newTaskName }),
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error editing task:', error));
  }

  function deleteTask(id) {
    fetch(`/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error deleting task:', error));
  }

  addTaskButton.addEventListener('click', addTask);
  inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  fetchTasks();
});
