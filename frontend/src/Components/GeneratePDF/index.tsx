import { Group, Button } from "@mantine/core";

function GeneratePDF({ submitQuestion }) {
  return (
    <Group position="center" mt="xl">
      <Button variant="default" onClick={submitQuestion}>
        Generate
      </Button>
    </Group>
  );
}

export default GeneratePDF;
