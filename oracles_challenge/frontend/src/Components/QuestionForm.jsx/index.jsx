import {
  Container,
  Title,
  Stack,
  Paper,
  Grid,
  Select,
  TextInput,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { find, findIndex, assign, cloneDeep } from "lodash";

const OptList = ({ questions, options, type, setQuestion, quesitonId }) => {
  const handleOptChange = (e, optId_) => {
    const question = find(questions, { id: quesitonId });
    const optionIdx = findIndex(options, { optId: optId_ });
    assign(question.options[optionIdx], { value: e.target.value });
    setQuestion((prev) => [...prev, question]);
    // setQuestion(updated);
  };
  return (
    <>
      {options.map((opt, idx) => (
        <Grid.Col span={6}>
          <Grid
            sx={{
              display: "flex",
              //   justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid.Col span={type == "n" ? 6 : 12}>
              <TextInput
                label={<Title order={5}>{idx + 1}</Title>}
                placeholder={`Option ${idx + 1}`}
                description={
                  type === "n"
                    ? "Add numeric answers only"
                    : "Add Text Answers Only"
                }
                error={opt.value === "" ? "Cannot be empty" : null}
                inputWrapperOrder={["label", "input", "description", "error"]}
                onChange={(e) => handleOptChange(e, opt.optId)}
              />
            </Grid.Col>

            {type === "n" && (
              <Grid.Col span={6}>
                <Select
                  sx={{ marginTop: "-8px" }}
                  placeholder="Unit"
                  data={[
                    { value: "null", label: "None" },
                    { value: "m", label: "m" },
                    { value: "cm", label: "cm" },
                    { value: "km", label: "km" },
                    { value: "mm", label: "mm" },
                    { value: "kg", label: "kg" },
                    { value: "g", label: "g" },
                    { value: "mg", label: "mg" },
                    { value: "ton", label: "ton" },
                    { value: "m/s", label: "m/s" },
                    { value: "km/h", label: "km/h" },
                    { value: "kg/m^3", label: "kg/m^3" },
                    { value: "g/cm^3", label: "g/cm^3" },
                    { value: "s", label: "Second" },
                    { value: "hr", label: "Hour" },
                    { value: "min", label: "Minute" },
                  ]}
                  onChange={(e) => handleTypeChange(e, question.id)}
                />
              </Grid.Col>
            )}
          </Grid>
        </Grid.Col>
      ))}
    </>
  );
};

const QuestionList = ({ questions, setQuestion }) => {
  const handleTypeChange = (e, id) => {
    const updatedItems = questions.map((item) => {
      if (item.id === id) {
        return { ...item, type: e };
      }
      return item;
    });
    console.log(updatedItems);
    setQuestion(updatedItems);
  };

  const handleQuestionChange = (e, questionId) => {
    setQuestion((prev) => {
      const idx = prev.findIndex((p) => p.id === questionId);
      const q = cloneDeep(prev[idx]);
      q.question = e.target.value;
      console.log(q);
      return [...prev, q];
    });
    e.preventDefault();
  };

  const removeQuestion = (e, questionKey) => {
    setQuestion((prev) => prev.filter((q) => q.id !== questionKey));
  };

  return (
    <div>
      {questions.map((question, idx) => (
        <>
          <Paper
            key={question.question}
            py={"xl"}
            px={"lg"}
            shadow={"md"}
            className="d-center"
            mb={"xs"}
            sx={{ position: "relative" }}
          >
            <Button
              sx={{
                position: "absolute",
                zIndex: 99,
                top: "5px",
                right: "10px",
              }}
              onClick={(e) => removeQuestion(e, question.id)}
            >
              X
            </Button>
            <Stack sx={{ width: "100%" }} py={"md"}>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid.Col span={6}>
                  <Title order={3}>Question {idx + 1}</Title>
                  <TextInput
                    placeholder={`Question`}
                    inputWrapperOrder={["input"]}
                    required
                    onChange={(e) => handleQuestionChange(e, question.id)}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Pick a Type of Question"
                    placeholder="Type"
                    data={[
                      { value: "n", label: "Numeric" },
                      { value: "t", label: "Text" },
                    ]}
                    onChange={(e) => handleTypeChange(e, question.id)}
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <OptList
                  questions={questions}
                  options={question.options}
                  type={question.type}
                  setQuestion={setQuestion}
                  quesitonId={question.id}
                />
              </Grid>
            </Stack>
          </Paper>
        </>
      ))}
    </div>
  );
};

function QuestionForm() {
  const [questions, setQuestion] = useState([
    {
      id: 1,
      question: "",
      type: "text",
      options: [
        { value: "", optId: 1, correct: true },
        { value: "", optId: 2, correct: false },
        { value: "", optId: 3, correct: false },
        { value: "", optId: 4, correct: false },
      ],
    },
  ]);

  const addQuestion = () => {
    let maxId = Math.max(...questions.map((obj) => obj.id));
    if (maxId === undefined || maxId === -Infinity) maxId = 0;

    setQuestion((prev) => [
      ...prev,
      {
        id: maxId + 1,
        question: "",
        type: "text",
        options: [
          { value: "", optId: 1, correct: true },
          { value: "", optId: 2, correct: false },
          { value: "", optId: 3, correct: false },
          { value: "", optId: 4, correct: false },
        ],
      },
    ]);
  };

  return (
    <Container className="fullbody">
      <Stack spacing={"md"}>
        <Title>Questions</Title>
        <QuestionList questions={questions} setQuestion={setQuestion} />
        <div className="d-right">
          <Button sx={{ width: "100px" }}>
            <Title order={1} sx={{ fontSize: "1.5rem" }}>
              Save
            </Title>
          </Button>
          <Button
            sx={{ width: "100px" }}
            className="add-btn"
            onClick={addQuestion}
          >
            <Title order={1}>+</Title>
          </Button>
        </div>
      </Stack>
    </Container>
  );
}

export default QuestionForm;
