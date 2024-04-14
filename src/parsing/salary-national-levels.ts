import { useSuspenseQuery } from "@tanstack/react-query";
import { parse, ParseResult } from "papaparse";

export type SalaryValue = number | "*" | "**" | "#";

export interface Salary {
  level: string,
  number: SalaryValue
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

export const useJobsWithNationalSalary = () => {
  return useSuspenseQuery({
    queryKey: ["jobs-by-salary-national"],
    queryFn: () => {
      return getNationalJobSalaries();
    },
  });
};

const toSalary = (val: string): SalaryValue => {
  switch (val) {
    case "*":
    case "**":
    case "#":
      return val;
    default:
      return parseFloat(val);
  }
};

const transformArraysToObjects = (arr: string[][]): JobSalary[] => {
  return arr.map((row) => ({
    jobTitle: row[9].replace(/\(\d+\)$/, "").trim(),
    matrixCode: row[8],
    totalEmployment: row[11],
    salary: {
      hourly: row.slice(20, 24).map(r => ({ level: 'abc', value: toSalary(r)})),
      annual: {
        "10": toSalary(row[25]),
        "25": toSalary(row[26]),
        "50": toSalary(row[27]),
        "75": toSalary(row[28]),
        "90": toSalary(row[29]),
      },
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
