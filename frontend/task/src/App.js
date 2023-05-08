import React from "react";
import { Container } from "@material-ui/core";
import TodoList from "./TodoList";

const App = () => {
  return (
    <Container maxWidth="sm">
      <TodoList />
    </Container>
  );
};

export default App;
