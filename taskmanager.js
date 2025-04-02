document.addEventListener('DOMContentLoaded', function() { //load webpage before running following code
    
    //below is creating and linking all elements/variables with the HTML

    const taskList = document.getElementById('taskList');             //list of tasks
    const sortButton = document.getElementById('sortButton');     //button to sort tasks alphabetically
    const filterButton = document.getElementById('filterButton'); //filter tasks button
    const saveButton = document.getElementById('saveButton');     //save to file button
    const taskEnter = document.getElementById('taskEnter');           //text box for task input
    const addButton = document.getElementById('addButton');         //add task button
    const clearButton = document.getElementById('clearButton');   //button to clear tasks
    const loadButton = document.getElementById('loadButton');     //opens file explorer
    const fileInput = document.getElementById('fileInput');           //loads selected file
    const categorySelect = document.getElementById('categorySelect'); //category selector for tasks

    let tasks = []; //array to store tasks, starts empty
    
    function showTasks(filterCategory = 'all') { //display tasks
        
        taskList.innerHTML = ''; //clear current tasks
        
        let tasksToShow;
        if (filterCategory === 'all') { //if category  'all' selected, show all tasks
            tasksToShow = tasks;
        } else { //show only tasks matching the selected category
            tasksToShow = []; //clear
            for (let i = 0; i < tasks.length; i++) { //loop through adding categorised tasks to temporary list
                if (tasks[i].category === filterCategory) { //add tasks to show list if they match the selected category
                    tasksToShow.push(tasks[i]);
                }
            }
        }
        
        for (let i = 0; i < tasksToShow.length; i++) { //loop through temp list and create a new item for it
            const task = tasksToShow[i];
            const li = document.createElement('li');
            if (task.completed) { //set content for completed tasks using literal templates (2 different options depending on if task is marked as complete or not)
                li.innerHTML = `
                    <input type="checkbox" checked>
                    <span class="completed">${task.text}</span>
                    <small>(${task.category})</small>
                    <button class="deleteButton">X</button>
                `;
            } else { //for incomplete tasks, first line creates checkbox, second adds styling, third adds small text, final creates delete button
                li.innerHTML = `     
                    <input type="checkbox"> 
                    <span>${task.text}</span>
                    <small>(${task.category})</small>
                    <button class="deleteButton">X</button>
                `;
            }
            
            const checkbox = li.querySelector('input[type="checkbox"]'); //goes through li element until it finds checkbox, then assigns that to const we have just made
            checkbox.addEventListener('click', function() { //mark task as completed or not when checkbox clicked
                task.completed = !task.completed; //switches between completed or not when clicked
                showTasks(); //refresh screen
            });
        
            const deleteButton = li.querySelector('.deleteButton'); //goes through li element until it finds delete button, then assigns that to const we have created
            deleteButton.addEventListener('click', function() { //when delete clicked, remove task
                let newTasks = []; //create new empty task list then go back through the original and add every item that wasn't deleted, then set the new list equal to the old list
                for (let j = 0; j < tasks.length; j++) {
                    if (tasks[j].id !== task.id) {
                        newTasks.push(tasks[j]);
                    }
                }
                tasks = newTasks; //replace old list with new list then display new list
                showTasks(); //refresh screen
            });
            
            taskList.appendChild(li); //add item to list
        }
    }

    function addTask() { //add task function
        const text = taskEnter.value.trim(); //get text and remove it's unneccesary spaces
        const category = categorySelect.value; //get the categorisation of the text
        if (text) { //checking for text input before adding task
           tasks.push({ //adding task to list
                text: text,                //task description
                category: category,        //category
                completed: false,          //boolean check to see if completed
                id: Date.now()             //unique ID used for identifying tasks for deletion
            });
            taskEnter.value = ''; //clears input area after adding task
            showTasks(); //refresh display
        }
    }

    addButton.addEventListener('click', function() { //complete add task function when add task button is clicked
        addTask();
    });
    
    taskEnter.addEventListener('keypress', function(e) { //when enter pressed, task is added
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    clearButton.addEventListener('click', function() { //when clear all pressed, clear all
        tasks = []; //clear task list
        showTasks(); //refresh screen
    });
    
    
    filterButton.addEventListener('click', function() { //filter tasks by category
        showTasks(categorySelect.value);
    });
    
  
    sortButton.addEventListener('click', function() { 
        tasks.sort(function(a, b) { //sort by text value
            if (a.text < b.text) return -1; //if a before b, return -1 meaning a should be before b
            if (a.text > b.text) return 1; //if a text comes after b text, return 1 meaning a should be after b
            return 0; //else they are equal and return nothing
        });
        showTasks(); //refresh screen
    });
    
    
    saveButton.addEventListener('click', function() { //save to file
        const data = JSON.stringify(tasks); //convert task text values to json format
        const blob = new Blob([data], {type: 'application/json'}); //create file (BLOB / Binary Large Object) to store json data
        const url = URL.createObjectURL(blob); //
        const a = document.createElement('a'); //creates anchor tag, not in page as not connected to DOM, it's URL is set to blob that contains task data, then set download to "tasks.json", getting browser to download it.
        a.href = url;
        a.download = 'tasks.json';
        a.click(); //triggers download
    });
    
    loadButton.addEventListener('click', function() { //opens file explorer
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) { //change happens when user selects a file
        const file = e.target.files[0]; //gets selected file, if multiple selected it picks first one
        const reader = new FileReader(); //setting up file reader that allows application to read content of file on user's computer
    
        reader.onload = function() { //what happens after file is read
            try {
                tasks = JSON.parse(reader.result); //parses JSON content
                showTasks(); //screen refresh
            } catch {
                alert('Invalid tasks file!'); //if not valid format, error thrown
            }
        };
        reader.readAsText(file); //file reader takes parsed content and turns it into text
    });
    showTasks();
});
