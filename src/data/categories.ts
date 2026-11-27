import type { Category, CategorySlug } from "@/types/commerce";

export const CATEGORIES: Category[] = [
  {
    slug: "footwear",
    name: "Footwear",
    shortTitle: "Footwear",
    tagline: "Everyday craft from city walks to formal evenings",
    description:
      "Breathable runners, hand-stitched full-grain leather loafers, minimal canvas sneakers, and warm-weather sandals built for Dhaka streets and beyond.",
    image: "/images/categories/footwear.jpg",
    imageAlt: "Curated leather loafers and minimalist canvas sneakers on travertine plinths",
  },
  {
    slug: "apparel",
    name: "Apparel",
    shortTitle: "Apparel",
    tagline: "Natural fibers tailored for the Bengal climate",
    description:
      "Airy linen shirts, fine handloom cotton panjabis, structured heavyweight tees, and tailored twill chinos designed for year-round comfort.",
    image: "/images/categories/apparel.jpg",
    imageAlt: "Folded oatmeal linen shirt, ivory handloom cotton panjabi, and khaki trousers",
  },
  {
    slug: "grocery",
    name: "Grocery & Pantry",
    shortTitle: "Grocery",
    tagline: "Single-origin harvests sourced directly across Bangladesh",
    description:
      "Wild Sundarbans honey, aged Dinajpur Chinigura rice, Sylhet orthodox black tea, wood-pressed mustard oil, and Bandarban highland coffee.",
    image: "/images/categories/grocery.jpg",
    imageAlt: "Raw golden wild honey, aromatic rice, and cold-pressed pantry essentials",
  },
];

export function getCategoryBySlug(slug: CategorySlug): Category {
  const found = CATEGORIES.find((category) => category.slug === slug);
  return found ?? CATEGORIES[0];
}
