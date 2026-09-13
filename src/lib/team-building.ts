/**
 * Editable content for /team-building. Everything on that page that is a
 * claim about who has visited lives here so it can be kept honest in one place.
 */

export interface CompanyLogo {
  name: string;
  /** SVG in public/images/logos — rendered white on the dark page. */
  src: string;
  width: number;
  height: number;
  /** Per-logo height so wordmarks of different shapes look optically equal. */
  sizeClass: string;
}

/**
 * Companies whose teams have come and played a show here. The page words this
 * as "teams from", not "clients" — only list a company if a group of its
 * people has actually visited.
 */
export const TEAMS_FROM: CompanyLogo[] = [
  {
    name: "Deloitte",
    src: "/images/logos/deloitte.svg",
    width: 210,
    height: 40,
    sizeClass: "h-7 md:h-9",
  },
  {
    name: "KPMG",
    src: "/images/logos/kpmg.svg",
    width: 512,
    height: 204,
    sizeClass: "h-12 md:h-16",
  },
  {
    name: "ServiceNow",
    src: "/images/logos/servicenow.svg",
    width: 130,
    height: 19,
    sizeClass: "h-6 md:h-8",
  },
  {
    name: "Tech Mahindra",
    src: "/images/logos/tech-mahindra.svg",
    width: 618,
    height: 175,
    sizeClass: "h-11 md:h-14",
  },
];

/**
 * Schools and colleges that have visited. Add real names here and they show
 * up as chips on the "Schools & colleges" card. Left empty on purpose: the
 * card reads fine without names, and listing a school that never came is a
 * claim about a real institution we can't stand behind.
 */
export const SCHOOLS_VISITED: string[] = [];
