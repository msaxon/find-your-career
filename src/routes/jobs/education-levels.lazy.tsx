import { createLazyFileRoute } from "@tanstack/react-router";
import { Autocomplete, Flex, Title } from "@mantine/core";
import { useJobsWithEducationLevel } from "../../parsing/education-levels.ts";
import { withSuspenseBoundary } from "../../components/suspense-boundary.tsx";
import { useMemo, useState } from "react";
import { BarChart } from "@mantine/charts";

const EducationLevels = () => {
  const { data: jobs } = useJobsWithEducationLevel();
  const [selectedJobName, setSelectedJobName] = useState("");

  const jobTitles = useMemo(() => {
    return jobs?.map((job) => job.jobTitle);
  }, [jobs]);

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.jobTitle === selectedJobName);
  }, [selectedJobName, jobs]);

  return (
    <Flex direction="column" gap={16}>
      <Title order={2}>Educational Levels</Title>
      <Autocomplete
        label="Job Title Search"
        data={jobTitles ?? []}
        value={selectedJobName}
        onChange={setSelectedJobName}
      />

      {selectedJobName && <Title order={3}>{selectedJobName}</Title>}
      {selectedJob && (
        <BarChart
          h={500}
          data={selectedJob.education}
          dataKey="level"
          unit="%"
          tooltipAnimationDuration={500}
          xAxisProps={{ angle: -20, tickMargin: 40, height: 200 }}
          series={[
            {
              name: "value",
              color: "green.8",
              label: "Percentage of Workers with this Level of Education",
            },
          ]}
        />
      )}
    </Flex>
  );
};

export const Route = createLazyFileRoute("/jobs/education-levels")({
  component: withSuspenseBoundary(EducationLevels),
});
