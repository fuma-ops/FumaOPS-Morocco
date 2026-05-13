export interface Project {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  projectUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "zakia-glow",
    name: "Zakia Glow",
    category: "Cosmétiques & Beauté",
    imageUrl: "/zakia-glow.png",
    projectUrl: "https://zakia-glow-boutique.vercel.app/",
  },
  {
    id: "nouhaila-store",
    name: "Nouhaila Store",
    category: "Mode & Vintage",
    imageUrl: "/nouhaila-store.png",
    projectUrl: "https://nouhaila-store-vintage.vercel.app/",
  },
  {
    id: "zine-jewelry",
    name: "ZINE Jewelry",
    category: "Bijouterie de luxe",
    imageUrl: "/zine-jewelry.png",
    projectUrl: "https://zine-template-jewelry.vercel.app/",
  },
  {
    id: "delice-marrakech",
    name: "Délice de Marrakech",
    category: "Pâtisserie & Gastronomie",
    imageUrl: "/delice-marrakech.png",
    projectUrl: "https://marrakech-sweet-delights-template.vercel.app/",
  },
  {
    id: "bread-mama",
    name: "BREAD MAMA MARRAKECH",
    category: "Boulangerie Artisanale",
    imageUrl: "/bread-mama.png",
    projectUrl: "https://bread-mama-apps.vercel.app/",
  },
];
