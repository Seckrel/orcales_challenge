import { useState, useEffect } from "react";
import "./App.css";
import { InitialData } from "./const/InitialData";
import Question from "./Components/QuestionForm";
import QuestionNumber from "./Components/QuestionNumber";
import GeneratePDF from "./Components/GeneratePDF";
import { v4 as uuidv4 } from "uuid";
import { Stepper, Group, Button, Overlay, Stack } from "@mantine/core";

function App() {
  const [questions, setQuestions] = useState([
    { id: uuidv4(), ...InitialData },
  ]);

  const [questionNo, setQuestionNo] = useState(1);
  const [studentNo, setStudentNo] = useState(2);

  const [downloadURL, setDownloadURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    const totalQuestionForm = [];
    for (let i = 0; i < questionNo; i++) {
      totalQuestionForm.push(InitialData);
    }

    setQuestions(totalQuestionForm);
  }, [questionNo]);

  const submitQuestion = async (e) => {
    const option = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions: questions, studentNo: studentNo }),
    };
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/generate/", option);
    const blob = await response.blob();

    const url = URL.createObjectURL(new Blob([blob]));
    setDownloadURL(url);
    setLoading(false);

    // e.preventDefault();
  };

  const clearNewForm = (e) => {
    setQuestions([{ id: uuidv4(), ...InitialData }]);
    setQuestionNo(1);
    setStudentNo(2);
    setDownloadURL(null);
    setLoading(false);
    setActive(0);
  };

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Number of Question"
          description="How many question"
          allowStepSelect={downloadURL ? false : true}
        >
          <QuestionNumber
            no={questionNo}
            setQuestionNo={setQuestionNo}
            noStd={studentNo}
            setStudentNo={setStudentNo}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Make Question"
          description="Fill Question"
          allowStepSelect={downloadURL ? false : true}
        >
          <Question questions={questions} setQuestions={setQuestions} />
        </Stepper.Step>
        <Stepper.Step
          label="Make Question"
          description="Fill Question"
          allowStepSelect={downloadURL ? false : true}
        >
          {downloadURL === null ? (
            <GeneratePDF submitQuestion={submitQuestion} />
          ) : (
            <Group position="center" mt="xl">
              <Stack>
                <Button
                  component="a"
                  download="question.zip"
                  href={downloadURL}
                >
                  Download
                </Button>
                <Button onClick={clearNewForm}>New Question Form</Button>
              </Stack>
            </Group>
          )}
        </Stepper.Step>
      </Stepper>

      {downloadURL === null ? (
        <Group position="center" mt="xl">
          {active > 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active < 2 && <Button onClick={nextStep}>Next step</Button>}
        </Group>
      ) : null}
      {loading && <Overlay color="#000" opacity={0.85} />}
    </>
  );
}

export default App;
