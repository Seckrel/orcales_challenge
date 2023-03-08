import { Paper, TextInput, Stack } from "@mantine/core";

function QuestionNumber({ no, setQuestionNo, noStd, setStudentNo }) {
  return (
    <Paper
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack>
        <TextInput
          type={"number"}
          value={no}
          label="Number of Question in the paper"
          placeholder="1"
          // style={{width: ""}}
          onChange={(e) => setQuestionNo(e.target.value)}
        />
        <TextInput
          type={"number"}
          value={noStd}
          label="How many student will take the exam?"
          placeholder="1"
          // style={{width: ""}}
          onChange={(e) => setStudentNo(e.target.value)}
        />
      </Stack>
    </Paper>
  );
}

export default QuestionNumber;
