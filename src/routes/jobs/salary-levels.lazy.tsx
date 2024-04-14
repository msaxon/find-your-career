import { createLazyFileRoute } from "@tanstack/react-router";
import { withSuspenseBoundary } from "../../components/suspense-boundary.tsx";
import { Autocomplete, Flex, Tabs, Title } from "@mantine/core";
import { useJobsWithNationalSalary } from "../../parsing/salary-national-levels.ts";
import { useMemo, useState } from "react";
import { BarChart } from "@mantine/charts";

export const SalaryLevels = () => {
  const { data: jobs } = useJobsWithNationalSalary();
  const [selectedJobName, setSelectedJobName] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("hourly");

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

        <Tabs.Panel value="hourly">
          {selectedJob && (
            <BarChart
              h={500}
              data={selectedJob.salary.hourly}
              dataKey="level"
              valueFormatter={(value) =>
                value === 115
                  ? `Greater than $115.00`
                  : `$${new Intl.NumberFormat("en-US").format(value)}`
              }
              tooltipAnimationDuration={500}
              xAxisProps={{ angle: -20, tickMargin: 40, height: 200 }}
              series={[
                {
                  name: "value",
                  color: "green.8",
                  label: "Average Salary in this Percentile",
                },
              ]}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="annual">
          <p>Second Tab</p>
          {selectedJob && (
            <BarChart
              h={500}
              data={selectedJob.salary.annual}
              dataKey="level"
              valueFormatter={(value) =>
                value === 239000
                  ? `Greater than $239,000`
                  : `$${new Intl.NumberFormat("en-US").format(value)}`
              }
              tooltipAnimationDuration={500}
              xAxisProps={{ angle: -20, tickMargin: 40, height: 200 }}
              series={[
                {
                  name: "value",
                  color: "green.8",
                  label: "Average Salary in this Percentile",
                },
              ]}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
};

export const Route = createLazyFileRoute("/jobs/salary-levels")({
  component: withSuspenseBoundary(SalaryLevels),
});
