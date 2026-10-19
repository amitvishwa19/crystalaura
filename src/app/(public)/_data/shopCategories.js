export const shopMenuGroups = [
    {
        title: "Shop by Type",
        items: [
            { label: "Gifts", slug: "gifts", description: "Curated gift sets & keepsakes" },
            { label: "Bracelets", slug: "bracelets", description: "Crystal & gemstone bracelets" },
            { label: "Pendants", slug: "pendants", description: "Gemstone pendants & amulets" },
            { label: "Malas", slug: "malas", description: "108-bead prayer malas" },
            { label: "Stones", slug: "stones", description: "Tumbled & polished stones" },
            { label: "Spheres", slug: "spheres", description: "Crystal spheres for meditation" },
            { label: "Pyramids", slug: "pyramids", description: "Orgonite & quartz pyramids" },
            { label: "Trees", slug: "trees", description: "Crystal & vastu trees" },
            { label: "Geodes", slug: "geodes", description: "Amethyst & quartz geodes" },
            { label: "Rings", slug: "rings", description: "Adjustable gemstone rings" },
            { label: "Pendulums", slug: "pendulums", description: "Divination pendulums" },
            { label: "Sets", slug: "sets", description: "Chakra & stone sets" },
        ],
    },
    {
        title: "Collections",
        items: [
            { label: "Crystals", slug: "crystals", description: "All healing crystals" },
            { label: "Jewelry", slug: "jewelry", description: "Wearable gemstone jewelry" },
            { label: "Meditation", slug: "meditation", description: "Tools for your practice" },
            { label: "Vastu", slug: "vastu", description: "Feng shui & vastu remedies" },
            { label: "All Products", slug: "all", description: "Browse the full catalog" },
        ],
    },
];

export const SHOP_CATEGORIES = [
    { label: "All Products", slug: "all" },
    ...shopMenuGroups.flatMap((group) => group.items),
];

const COLLECTION_SLUGS = ["crystals", "jewelry", "meditation", "vastu"];

const TAG_ALIASES = {
    bracelets: ["bracelet"],
    pendants: ["pendant", "amulet"],
    malas: ["mala", "rudraksha"],
    stones: ["stone", "stones", "tumbled", "energy"],
    spheres: ["sphere"],
    pyramids: ["pyramid"],
    trees: ["tree"],
    geodes: ["geode"],
    rings: ["ring"],
    pendulums: ["pendulum"],
    sets: ["set", "chakra"],
};

const GIFT_TAGS = ["set", "decor", "vastu", "gift"];

export function productMatchesCategory(product, slug) {
    if (!slug || slug === "all") return true;

    const price = product.priceNum ?? product.price ?? 0;
    const tags = (product.tags || []).map((tag) => tag.toLowerCase());
    const name = (product.name || "").toLowerCase();

    if (slug === "gifts") {
        return tags.some((tag) => GIFT_TAGS.includes(tag)) || price <= 1000;
    }

    if (COLLECTION_SLUGS.includes(slug)) {
        return (product.category || "").toLowerCase() === slug;
    }

    const aliases = TAG_ALIASES[slug] || [slug];
    return tags.some((tag) => aliases.includes(tag)) || aliases.some((alias) => name.includes(alias));
}
