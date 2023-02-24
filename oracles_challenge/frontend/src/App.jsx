import { useState } from "react";
import "./App.css";
import QuestionForm from "./Components/QuestionForm.jsx";

function App() {
  const [count, setCount] = useState(0);

  return <QuestionForm />;
}

export default App;
