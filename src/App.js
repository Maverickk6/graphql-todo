import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const READ_TODOS = gql`
  query todos {
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

function App() {
  const { data, loading, error } = useQuery(READ_TODOS);

  let input;
  const [createTodo] = useMutation(CREATE_TODO);

  const [deleteTodo] = useMutation(REMOVE_TODO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;

  return (
    <div className="app">
      <h3>Create A New Todo</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          createTodo({ variables: { text: input.value } });
          input.value = "";
          window.location.reload();
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Enter a Todo"
          ref={node => {input = node;}}
        ></input>
        <br />
        <button className="btn btn-md btn-primary " type="submit">
          Submit
        </button>
      </form>
      <ul>
        {data.todos.map((todo) => 
          <li key={todo.id}>
            <span className={todo.completed ? "done" : "pending"}>
              {todo.text}
            </span>
            <button
              className="btn btn-sm btn-danger rounded-circle float-right"
              onClick={() => {
                deleteTodo({ variables: { id: todo.id } });
                window.location.reload();
              }}
            >
              X
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default App;
