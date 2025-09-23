import Report from "../../../images/reportPL.svg";
import Search from "../../../images/searchPL.svg";
import Dashboard from "../../../images/dashboardPL.svg";
import Check from "../../../images/checkPL.svg";

export const STEPS = [
  {
    id: "report",
    img: Report,
    alt: "Report icon",
    title: "Step 1: Log all your cards",
    text: 'Go to "My cards" to report the cards you own and your duplicates. You can mark them all as owned or as duplicated and adjust later.',
    to: "/cards",
  },
  {
    id: "search",
    img: Search,
    alt: "Search icon",
    title: "Step 2: Search for the cards you need",
    text: 'Open "Swap", pick a chapter & card number to see who has it.',
    to: "/swap/card",
  },
  {
    id: "dashboard",
    img: Dashboard,
    alt: "Dashboard icon",
    title: "Check your conversations",
    text: 'Regularly check your "Dashboard" for new messages.',
    to: "/swap/dashboard",
  },
  {
    id: "keep-updated",
    img: Check,
    alt: "Check icon",
    title: "Keep your cards up to date",
    text: 'Update "My cards" often so others see accurate info.',
    to: "/cards",
  },
];
