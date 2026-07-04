export type RequestTicket = {
  id: string;
  requestBy: { name: string; email: string; avatar?: string };
  subject: string;
  priority: "High" | "Medium" | "Low";
  agent: { name: string; email: string; avatar?: string };
  createDate: string;
  status: "Pending" | "Solved";
};

export const data: RequestTicket[] = [
  {
    id: "#10234",
    requestBy: { name: "Alice Smith", email: "alice@example.com" },
    subject: "Login issue on mobile app",
    priority: "High",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-01",
    status: "Pending",
  },
  {
    id: "#10235",
    requestBy: { name: "Bob Jones", email: "bob@example.com" },
    subject: "Billing inquiry",
    priority: "Medium",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-02",
    status: "Solved",
  },
  {
    id: "#10236",
    requestBy: { name: "Charlie Brown", email: "charlie@example.com" },
    subject: "Feature request: Dark mode",
    priority: "Low",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-03",
    status: "Pending",
  },
  {
    id: "#10237",
    requestBy: { name: "Diana Prince", email: "diana@example.com" },
    subject: "Cannot access dashboard",
    priority: "High",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-04",
    status: "Solved",
  },
  {
    id: "#10238",
    requestBy: { name: "Evan Wright", email: "evan@example.com" },
    subject: "Update payment method",
    priority: "Medium",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-05",
    status: "Pending",
  },
  {
    id: "#10239",
    requestBy: { name: "Fiona Gallagher", email: "fiona@example.com" },
    subject: "API rate limit exceeded",
    priority: "High",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-06",
    status: "Pending",
  },
  {
    id: "#10240",
    requestBy: { name: "George Miller", email: "george@example.com" },
    subject: "Export data to CSV",
    priority: "Low",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-07",
    status: "Solved",
  },
  {
    id: "#10241",
    requestBy: { name: "Hannah Abbott", email: "hannah@example.com" },
    subject: "Password reset not working",
    priority: "High",
    agent: { name: "Sarah Connor", email: "sarah@support.com" },
    createDate: "2023-10-08",
    status: "Pending",
  },
  {
    id: "#10242",
    requestBy: { name: "Ian Malcolm", email: "ian@example.com" },
    subject: "Integration with Slack",
    priority: "Medium",
    agent: { name: "John Doe", email: "john@support.com" },
    createDate: "2023-10-09",
    status: "Solved",
  },
  {
    id: "#10243",
    requestBy: { name: "Julia Child", email: "julia@example.com" },
    subject: "Account deletion request",
    priority: "Low",
    agent: { name: "Mike Ross", email: "mike@support.com" },
    createDate: "2023-10-10",
    status: "Pending",
  },
];
