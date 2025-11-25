import {
  GroupedReports,
  Perspective,
  Report,
  ReportSelect,
} from "@/app/utils/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { triggerTagRevalidation } from "@/actions/tasks";

export const formatTimestamp = {
  relative: (timestamp: number) => {
    return moment.unix(timestamp).fromNow();
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DBPersona = {
  creation_date: string;
  last_modified_date: string;
  label: string;
  firebase_id: string;
  persona_id: string; // The full ID: persona_{firebase_id}_{name}
  persona: string; // The short name: steve_jobs
  pretty_name: string;
  goal: string;
  id: string; // Node's internal ID (same as persona_id)
  count: number;
};

export type DBReport = {
  creation_date: string;
  last_modified_date: string;
  label: string;
  report_id: string;
  content_url: string;
};

export function convertDbPersonaToMenuItem(dbpersona: DBPersona): Perspective {
  const { persona_id, persona, pretty_name, goal, count } = dbpersona;
  // Use persona_id (the full ID) for all routing/identification
  const personaAsMenuItem = {
    perceivedBy: persona_id,
    personType: persona_id,
    count,
    name: persona_id,
    key: persona_id,
    href: `/perception/${persona_id}`,
    prettyName: pretty_name,
    goal: goal,
    id: persona_id,
  };
  return personaAsMenuItem;
}

export function convertDbReportToMenuItem(report: DBReport): Report {
  const reportDate = new Date(report.creation_date);
  const reportMonth = reportDate.toLocaleString("default", {
    month: "long",
  });
  const reportYear = reportDate.getFullYear();
  const reportDay = reportDate.getDate();
  const reportMonthYear = `${reportMonth} ${reportYear}`;
  const reportName = `${reportDay} ${reportMonth}`;
  const reportLink = `/reports/view/${report.report_id}`;
  const reportAsMenuItem = {
    id: report.report_id,
    name: reportMonthYear,
    href: reportLink,
    reportId: report.report_id,
    prettyName: reportName,
    key: report.report_id,
  };
  return reportAsMenuItem;
}

export function groupReportsByMonth(reports: Report[]): GroupedReports[] {
  const reportsWithNext = reports.map((report, index) => ({
    ...report,
    nextItemHref: reports[index + 1]?.href || "/",
  }));
  //@ts-ignore TODO
  const groupedReportsObj: GroupedReports[] = reportsWithNext.reduce(
    (groupedReports: GroupedReports[], currentReport: Report) => {
      const reportMonth = currentReport.name;
      if (reportMonth in groupedReports) {
        groupedReports[reportMonth].children.push(currentReport);
      } else {
        groupedReports[reportMonth] = {
          name: reportMonth,
          href: "#",
          children: [currentReport],
        };
      }
      return groupedReports;
    },
    {},
  );
  const groupReportsArray = Object.values(groupedReportsObj);
  return groupReportsArray;
}

export function toTitleCase(str: string) {
  return str
    .replaceAll("_", " ")
    .replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
    );
}

export async function triggerRevalidationAction(tag: string) {
  await triggerTagRevalidation(tag);
}
