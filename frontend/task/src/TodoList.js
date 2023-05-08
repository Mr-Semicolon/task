import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  IconButton ,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const fetchTodos = async () => {
    const response = await axios.get("/todos");
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleNewTodoTitleChange = (event) => {
    setNewTodoTitle(event.target.value);
  };

  const handleNewTodoSubmit = async (event) => {
    event.preventDefault();

    const newTodo = {
      title: newTodoTitle,
      completed: false,
    };

    const response = await axios.post("/todos", newTodo);
    setTodos([...todos, response.data]);
    setNewTodoTitle("");
  };

  const handleTodoCheckboxChange = async (event, todo) => {
    const updatedTodo = {
      ...todo,
      completed: event.target.checked,
    };

    await axios.put(`/todos/${todo._id}`, updatedTodo);
    setTodos(todos.map((t) => (t._id === todo._id ? updatedTodo : t)));
  };

  const handleTodoDelete = async (todo) => {
    await axios.delete(`/todos/${todo._id}`);
    setTodos(todos.filter((t) => t._id !== todo._id));
  };

  return (
    <div>
      <form onSubmit={handleNewTodoSubmit}>
        <TextField
          label="New todo"
          value={newTodoTitle}
          onChange={handleNewTodoTitleChange}
        />
        <Button variant="contained" color="primary" type="submit">
          Add
        </Button>
      </form>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo._id}>
            <ListItemIcon>
              <Checkbox
                checked={todo.completed}
                onChange={(event) => handleTodoCheckboxChange(event, todo)}
              />
            </ListItemIcon>
            <ListItemText primary={todo.title} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleTodoDelete(todo)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoList;
