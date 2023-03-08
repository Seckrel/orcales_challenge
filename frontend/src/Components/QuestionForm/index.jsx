import { TextInput, Stack, Grid, Select, Button, Paper } from "@mantine/core";
import { InitialData } from "../../const/InitialData";
import { v4 as uuidv4 } from "uuid";

function Question({ questions, setQuestions }) {
  const handleAddQuestion = (e) => {
    e.preventDefault();
    setQuestions((prev) => [...prev, { id: uuidv4(), ...InitialData }]);
  };

  const handleQuestionChange = (e, idx) => {
    e.preventDefault();
    const newQuestions = [...questions];
    const newnewQuestions = newQuestions.map((q) => {
      if (q.id === idx) {
        q.question = e.target.value;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleTypeChange = (e, idx) => {
    const newQuestions = [...questions];
    const newnewQuestions = newQuestions.map((q) => {
      if (q.id === idx) {
        q.type = e;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleUnitChange = (e, idx) => {
    const newQuestions = [...questions];
    const newnewQuestions = newQuestions.map((q) => {
      if (q.id === idx) {
        q.unit = e;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleCorrectChange = (e, idx) => {
    const newQestions = [...questions];
    const newnewQuestions = newQestions.map((q) => {
      if (q.id === idx) {
        q.correct = e.target.value;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleWrong1Change = (e, idx) => {
    const newQestions = [...questions];
    const newnewQuestions = newQestions.map((q) => {
      if (q.id === idx) {
        q.wrong1 = e.target.value;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleWrong2Change = (e, idx) => {
    const newQestions = [...questions];
    const newnewQuestions = newQestions.map((q) => {
      if (q.id === idx) {
        q.wrong2 = e.target.value;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  const handleWrong3Change = (e, idx) => {
    const newQestions = [...questions];
    const newnewQuestions = newQestions.map((q) => {
      if (q.id === idx) {
        q.wrong3 = e.target.value;
      }
      return q;
    });
    setQuestions(newnewQuestions);
  };

  return (
    <>
      <Paper shadow="xs" p="lg">
        <form>
          {questions.map((question, idx) => {
            return (
              <Paper
                my={6}
                shadow="sm"
                p="lg"
                style={{ backgroundColor: "#e3baba17" }}
              >
                <Stack key={idx}>
                  <Grid>
                    <Grid.Col span={8}>
                      <TextInput
                        key={question.id}
                        label={`Question ${idx + 1}`}
                        name={`Question${idx}`}
                        value={question.question}
                        onChange={(e) => handleQuestionChange(e, question.id)}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        key={question.id}
                        label="Type of Question"
                        name={`Type${idx}`}
                        placeholder="Pick one"
                        value={question.type}
                        onChange={(e) => handleTypeChange(e, question.id)}
                        data={[
                          { value: "text", label: "Text" },
                          { value: "numeric", label: "Numeric" },
                        ]}
                      />
                    </Grid.Col>
                    {question.type === "numeric" && (
                      <Grid.Col span={12}>
                        <div style={{ width: "25%" }}>
                          <Select
                            key={question.id}
                            label="Type of Question"
                            name={`Type${idx}`}
                            placeholder="Pick one"
                            value={question.unit}
                            onChange={(e) => handleUnitChange(e, question.id)}
                            data={[
                              { value: "m", label: "meters" },
                              { value: "km", label: "km" },
                              { value: "cm", label: "cm" },
                              { value: "mm", label: "mm" },
                              { value: "kg", label: "kg" },
                              { value: "g", label: "g" },
                              { value: "mg", label: "mg" },
                              { value: "ton", label: "ton" },
                              { value: "kg/m^3", label: "kg/m<sup>3</sup>" },
                              { value: "g/cm^3", label: "g/cm<sup>3</sup>" },
                            ]}
                          />
                        </div>
                      </Grid.Col>
                    )}
                    <Grid.Col span={6}>
                      <TextInput
                        key={question.id}
                        name={`Correct${idx}`}
                        label={`Correct Answer`}
                        value={question.correct}
                        onChange={(e) => handleCorrectChange(e, question.id)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        key={question.id}
                        name={`Wrong1${idx}`}
                        label={`Wrong 1`}
                        value={question.wrong1}
                        onChange={(e) => handleWrong1Change(e, question.id)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        key={question.id}
                        name={`Wrong2${idx}`}
                        label={`Wrong 2`}
                        value={question.wrong2}
                        onChange={(e) => handleWrong2Change(e, question.id)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        key={question.id}
                        name={`Wrong3${idx}`}
                        label={`Wrong 3`}
                        value={question.wrong3}
                        onChange={(e) => handleWrong3Change(e, question.id)}
                      />
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Paper>
            );
          })}
        </form>
      </Paper>
      <Button onClick={handleAddQuestion}>+</Button>
    </>
  );
}

export default Question;
