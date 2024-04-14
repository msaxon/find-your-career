import { useSuspenseQuery } from "@tanstack/react-query";
import { parse, ParseResult } from "papaparse";

export type SalaryValue = number | "Unavailable" | "**" | "#";

export interface Salary {
  level: string;
  number: SalaryValue;
}

export interface JobSalary {
  jobTitle: string;
  matrixCode: string;
  totalEmployment: number;
  salary: {
    hourly: Salary[];
    annual: Salary[];
  };
}

const file = "/job-salary-national.csv";

const mapIndexToPercentile = (i: number): string => {
  switch (i) {
    case 0:
      return "10th percentile";
    case 1:
      return "25th percentile";
    case 2:
      return "50th percentile";
    case 3:
      return "75th percentile";
    case 4:
      return "90th percentile";
    default:
      return "0";
  }
};

export const useJobsWithNationalSalary = () => {
  return useSuspenseQuery({
    queryKey: ["jobs-by-salary-national"],
    queryFn: () => {
      return getNationalJobSalaries();
    },
  });
};

const toSalary = (val: string, isHourly: boolean): SalaryValue => {
  switch (val) {
    case "*":
    case "**":
      return "Unavailable";
    case "#":
      return isHourly ? 115 : 239000;
    default:
      return parseFloat(val.replace(",", ""));
  }
};

const transformArraysToObjects = (arr: string[][]): JobSalary[] => {
  return arr.map((row) => ({
    jobTitle: row[9].replace(/\(\d+\)$/, "").trim(),
    matrixCode: row[8],
    totalEmployment: row[11],
    salary: {
      hourly: row.slice(20, 25).map((r, index) => ({
        level: mapIndexToPercentile(index),
        value: toSalary(r, true),
      })),
      annual: row.slice(25, 30).map((r, index) => ({
        level: mapIndexToPercentile(index),
        value: toSalary(r, false),
      })),
    },
  }));
};

const getNationalJobSalaries = (): Promise<JobSalary[]> => {
  return new Promise((resolve, reject) => {
    parse<string[]>(file, {
      download: true,
      skipEmptyLines: true,
      complete(results: ParseResult<string[]>) {
        const data = transformArraysToObjects(results.data);
        console.log("data", data.splice(0, 5));
        return resolve(data);
      },
      error(error: Error) {
        console.log("error");
        return reject(error);
      },
    });
  });
};
