import { createLazyFileRoute } from "@tanstack/react-router";
import { withSuspenseBoundary } from "../../components/suspense-boundary.tsx";
import { Autocomplete, Flex, Tabs, Title } from "@mantine/core";
import { useJobsWithNationalSalary } from "../../parsing/salary-national-levels.ts";
import { useMemo, useState } from "react";
import {BarChart} from "@mantine/charts";

export const SalaryLevels = () => {
  const { data: jobs } = useJobsWithNationalSalary();
  const [selectedJobName, setSelectedJobName] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("first");

  const jobTitles = useMemo(() => {
    return [...new Set(jobs?.map((job) => job.jobTitle))];
  }, [jobs]);

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.jobTitle === selectedJobName);
  }, [selectedJobName, jobs]);

  return (
    <Flex direction="column" gap={16}>
      <Title order={2}>Educational Levels</Title>
      {jobs && (
        <Autocomplete
          label="Job Title Search"
          data={jobTitles ?? []}
          value={selectedJobName}
          onChange={setSelectedJobName}
        />
      )}
      {selectedJobName && <Title order={3}>{selectedJobName}</Title>}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="hourly">Hourly</Tabs.Tab>
          <Tabs.Tab value="annual">Annual</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          {selectedJob && (
              <BarChart
                  h={500}
                  data={selectedJob.salary.hourly}
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
        </Tabs.Panel>
        <Tabs.Panel value="second">Second panel</Tabs.Panel>
      </Tabs>
    </Flex>
  );
};

export const Route = createLazyFileRoute("/jobs/salary-levels")({
  component: withSuspenseBoundary(SalaryLevels),
});
