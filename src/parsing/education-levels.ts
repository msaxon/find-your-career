import { parse, ParseResult } from "papaparse";
import { useSuspenseQuery } from "@tanstack/react-query";

export interface JobEducationalLevel {
  jobTitle: string;
  matrixCode: string;
  education: [
    {
      level: string;
      value: number;
    },
  ];
}

const file: string = "/education-levels.current.csv";

export const useJobsWithEducationLevel = () => {
  return useSuspenseQuery({
    queryKey: ["jobs-by-education-level"],
    queryFn: () => {
      return getJobNames();
    },
  });
};

const indexToLevel = (index: number): string => {
  switch (index) {
    case 0:
      return "Less than high school diploma";
    case 1:
      return "High school diploma or equivalent";
    case 2:
      return "Some college, no degree";
    case 3:
      return "Associate's degree";
    case 4:
      return "Bachelor's degree";
    case 5:
      return "Master's degree";
    case 6:
      return "Doctoral or professional degree";
    default:
      return "";
  }
};

const transformArraysToObjects = (arr: string[][]): JobEducationalLevel[] => {
  return arr.map((row) => ({
    jobTitle: row[0].replace(/\(\d+\)$/, "").trim(),
    matrixCode: row[1],
    education: row.slice(2).map((num, index) => {
      return {
        level: indexToLevel(index),
        value: parseFloat(num),
      };
    }),
  }));
};


export const getJobNames = (): Promise<JobEducationalLevel[]> => {
  return new Promise((resolve, reject) => {
    parse<string[]>(file, {
      download: true,
      skipEmptyLines: true,
      complete(results: ParseResult<string[]>) {
        const jobLevels: JobEducationalLevel[] = transformArraysToObjects(results.data);
        return resolve(jobLevels);
      },
      error(error: Error) {
        console.log("error");
        return reject(error);
      },
    });
  });
};
