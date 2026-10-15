import type { StaticImageData } from "next/image";
import brooklynScouts from "./photos/brooklyn-scout-leader-recruiting.jpg";
import chamisal from "./photos/chamisal-adobe-plastering.jpg";
import chicago from "./photos/chicago-easter-sunday.jpg";
import chicagoHydrant from "./photos/chicago-hydrant-summer.jpg";
import chicagoProduce from "./photos/chicago-sidewalk-produce.jpg";
import chicagoTalentShow from "./photos/chicago-block-club-talent-show.jpg";
import geesBend from "./photos/gees-bend-quilting.jpg";
import miTierra from "./photos/san-antonio-mi-tierra-cafe.jpg";
import newportNews from "./photos/newport-news-picnic.jpg";
import penasco from "./photos/penasco-community-dance.jpg";
import pieTown from "./photos/pie-town-community-dinner.jpg";
import taos from "./photos/taos-fiesta-childrens-dance.jpg";

export type ArchivePhoto = {
  src: StaticImageData;
  caption: string;
  credit: string;
  href: string;
  /** CSS object-position, for photos that need a different crop focus. */
  focus?: string;
};

// Public-domain photos from the Library of Congress (FSA/OWI, "No known
// restrictions on publication") and the National Archives (EPA DOCUMERICA,
// U.S. government work). Original archive titles and rights are in
// photos/CREDITS.md. City neighborhoods come first because the first pilot
// is in Black and Latino city neighborhoods.
export const archivePhotos: ArchivePhoto[] = [
  {
    src: newportNews,
    caption:
      "Neighbors serve food at a picnic in Newport News, Virginia, 1936.",
    credit: "Paul Carter, Library of Congress",
    href: "https://www.loc.gov/item/2017734700/",
  },
  {
    src: chicagoHydrant,
    caption:
      "Girls laugh and cool off in the spray from a fire hydrant in Woodlawn, Chicago, 1973.",
    credit: "John H. White, National Archives",
    href: "https://catalog.archives.gov/id/556136",
  },
  {
    src: miTierra,
    caption:
      "Diners share a meal at Mi Tierra Cafe in San Antonio's old Mexican market, 1972.",
    credit: "Bob Smith, National Archives",
    href: "https://catalog.archives.gov/id/547779",
  },
  {
    src: chicagoProduce,
    caption:
      "Vendors set out fresh fruit and vegetables on a sidewalk on Chicago's South Side, 1973.",
    credit: "John H. White, National Archives",
    href: "https://catalog.archives.gov/id/556211",
  },
  {
    src: brooklynScouts,
    caption:
      "A Scout leader recruits young people in Bedford-Stuyvesant, Brooklyn, 1974.",
    credit: "Danny Lyon, National Archives",
    href: "https://catalog.archives.gov/id/555899",
  },
  {
    src: chicagoTalentShow,
    caption:
      "Kids perform at a neighborhood council's open-air talent show on Chicago's South Side, 1973.",
    credit: "John H. White, National Archives",
    href: "https://catalog.archives.gov/id/556287",
  },
  {
    src: chicago,
    caption:
      "Churchgoers gather in their Easter best after services in Chicago, 1941.",
    credit: "Edwin Rosskam, Library of Congress",
    href: "https://www.loc.gov/item/2017729518/",
  },
  {
    src: geesBend,
    caption:
      "Women and a young girl sew a quilt together in Gee's Bend, Alabama, 1937.",
    credit: "Arthur Rothstein, Library of Congress",
    href: "https://www.loc.gov/item/2017775821/",
  },
  {
    src: taos,
    caption:
      "Children dance at the town fiesta while neighbors watch in Taos, New Mexico, 1940.",
    credit: "Russell Lee, Library of Congress",
    href: "https://www.loc.gov/item/2017743010/",
  },
  {
    src: chamisal,
    caption:
      "Two women plaster an adobe house together in Chamisal, New Mexico, 1940.",
    credit: "Russell Lee, Library of Congress",
    href: "https://www.loc.gov/item/2017742746/",
    focus: "50% 48%",
  },
  {
    src: pieTown,
    caption:
      "Neighbors share dinner at an all-day community sing in Pie Town, New Mexico, 1940.",
    credit: "Russell Lee, Library of Congress",
    href: "https://www.loc.gov/item/2017742634/",
  },
  {
    src: penasco,
    caption:
      "Couples fill the floor at a village dance in Peñasco, New Mexico, 1943.",
    credit: "John Collier Jr., Library of Congress",
    href: "https://www.loc.gov/item/2017842176/",
  },
];
