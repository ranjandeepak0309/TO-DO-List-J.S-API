// get the url
const apiUrl = "https://jsonplaceholder.typicode.com/todos";

const todoContainer = document.getElementById("todoContainer");
const todoForm = document.getElementById("todoForm");
const loader = document.getElementById("loader");
const todoInput = document.getElementById("newTodo");

// show the loader
const showLoader = () => {
  loader.style.display = "block";
};
// hide the loader
const hideLoader = () => {
  loader.style.display = "none";
};
// get all the todo
const fetchToDoList = () => {
  showLoader(); //first show the loader then fetch api
  fetch(`${apiUrl}?_limit=10`) //add queryparam for filter first 10items
    .then((Response) => Response.json()) //convert all to json formate
    .then((todos) => {
      // console.log(todos);
      //getting all the todos here so
      // append all the todos inside the todoContainer
      todoContainer.innerHTML = ""; //append data by innerhtml so fst keep empty
      // here we add todo in todoContainer by dom manipulatn
      todos.forEach((todo) => displayTodoItems(todo));
      hideLoader(); //once done then hide the loader
    })

    //error handling if api getting fail
    .catch((err) => {
      todoContainer.innerHTML = "Error while fetching todos";
      todoContainer.style.color = "red";
      hideLoader();
    });
};

// add todos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoader();
  const todoText = todoInput.value.trim();//.trim() for removing extra spaces
  // payload
  const data = {
    title: todoText,
    completed: false,
  };
  console.log(JSON.stringify(data));

  // POST API
  if(todoText.length > 1){
    fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((Response)=>
        Response.json()
    
      )
      .then((todo)=>{
        displayTodoItems(todo);
        todoInput.value="";//to make input field empty after clicking add btn
        hideLoader();
      })
      .catch((error) =>{
        todoContainer.innerHTML="Error while adding todos";
        todoContainer.style.color = "red";
        hideLoader();
      })
  }
});
// edit todos

const editTodoItem = (id, todoText, editBtn) => {
    todoText.disabled=false;
    editBtn.style.display="none";
    editBtn.nextSibling.style.display="block";
   
};

// save todo

const saveTodoItem = (id,todoText,editBtn,saveBtn)=>{
   const updatedText = todoText.value.trim();
 
//    PUT API
if(updatedText.length>1){
    showLoader();
    fetch(`${apiUrl}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({title:updatedText,completed:false}),
    })
    .then((response)=>response.json())
    .then((todos)=>{
        todoText.disabled = true;
        editBtn.style.display="block";
        saveBtn.style.display="none";
        hideLoader();
    })
    .catch((err)=>{
        todoContainer.innerHTML= "Error while updating todos";
        todoContainer.style.color = "red";
        hideLoader();
    })

    }
}


// delete todos
const deleteTodoItem =(id,todoDiv)=>{
    showLoader();
    fetch(`${apiUrl}/${id}`,{
        method : "DELETE"
    })
    .then(()=>{
        todoDiv.remove();
        hideLoader();
    })
    
}

// display all todos item
const displayTodoItems = (todo) => {
  //here information of 1 todo pass
  // creating a todo item div
  const todoDiv = document.createElement("div");
  todoDiv.className = "todo-item";
  todoDiv.setAttribute("data-id", todo.id); // look like <div class="todo-item" data-id="1"><div>
  // apppending an input element,edit,save and delete btn
  const todoText = document.createElement("input");
  todoText.type = "text";
  todoText.value = todo.title;
  todoText.disabled = true; //disble the text so user can write or edit

  //  edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editTodoItem(todo.id, todoText, editBtn);

  //  save button
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.style.display = "none"; //so that it doesnt visible when edit btn visible
  saveBtn.onclick = () => saveTodoItem(todo.id, todoText, editBtn, saveBtn);

  //  delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => deleteTodoItem(todo.id, todoDiv); //bc we del whole div

  // by default edit is visible and save btn is hidden

  // appending all these items inside the todocontainer
  todoDiv.appendChild(todoText);
  todoDiv.appendChild(editBtn);
  todoDiv.appendChild(saveBtn);
  todoDiv.appendChild(deleteBtn);

  // also append to todo caontainer main
  todoContainer.appendChild(todoDiv);
};

window.onload = fetchToDoList();
