import { products as fallbackProducts, categories as fallbackCategories } from "@/app/(public)/_data/products";

const BACKEND_URL = (
    process.env.DEVLOMATIX_BACKEND_URL || 
    process.env.APP_URL || 
    "https://dev.devlomatix.com"
).replace(/\/$/, "");

const STORE_API_KEY = (
    process.env.DEVLOMATIX_STORE_API_KEY || 
    process.env.API_KEY || 
    ""
).trim();

/**
 * Low-level request wrapper for Devlomatix Storefront API
 */
async function storefrontFetch(endpoint, options = {}) {
    const url = `${BACKEND_URL}/api/v1/storefront${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
        "x-api-key": STORE_API_KEY,
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({ success: false, error: "Invalid JSON response" }));

    if (!response.ok) {
        throw new Error(data.error || `Storefront API request failed (${response.status})`);
    }

    return data;
}

/**
 * Fetch store details, shipping thresholds, currencies and settings
 */
export async function getStoreInfo() {
    try {
        if (!STORE_API_KEY) {
            return {
                success: true,
                store: {
                    name: "CrystalAura",
                    currency: "INR",
                    shipping: { defaultCost: 99, freeShippingThreshold: 999 },
                },
            };
        }

        const data = await storefrontFetch("/store", {
            next: { tags: ["store-info"], revalidate: 300 },
        });
        return data;
    } catch (error) {
        console.warn("[DEVLOMATIX_STORE_INFO_FALLBACK]", error.message);
        return {
            success: true,
            fallback: true,
            store: {
                name: "CrystalAura",
                currency: "INR",
                shipping: { defaultCost: 99, freeShippingThreshold: 999 },
            },
        };
    }
}

/**
 * Fetch active product categories
 */
export async function getStoreCategories() {
    try {
        if (!STORE_API_KEY) {
            return { success: true, categories: fallbackCategories };
        }

        const data = await storefrontFetch("/categories", {
            next: { tags: ["store-categories"], revalidate: 300 },
        });

        if (data.categories && data.categories.length > 0) {
            return data;
        }
        return { success: true, categories: fallbackCategories };
    } catch (error) {
        console.warn("[DEVLOMATIX_CATEGORIES_FALLBACK]", error.message);
        return { success: true, fallback: true, categories: fallbackCategories };
    }
}

/**
 * Fetch catalog products with filtering, search, sorting and pagination
 */
export async function getStoreProducts(filters = {}) {
    try {
        if (!STORE_API_KEY) {
            return filterFallbackProducts(filters);
        }

        const params = new URLSearchParams();
        if (filters.category && filters.category !== "all") params.set("category", filters.category);
        if (filters.search) params.set("search", filters.search);
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
        if (filters.inStock) params.set("inStock", "true");
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await storefrontFetch(`/products${query}`, {
            next: { tags: ["store-products"], revalidate: 60 },
        });

        if (data.products && data.products.length > 0) {
            return data;
        }

        // If backend returned empty list, provide fallback catalog
        return filterFallbackProducts(filters);
    } catch (error) {
        console.warn("[DEVLOMATIX_PRODUCTS_FALLBACK]", error.message);
        return filterFallbackProducts(filters);
    }
}

/**
 * Fetch full product detail by slug or id
 */
export async function getStoreProductBySlug(slug) {
    try {
        if (!STORE_API_KEY) {
            const found = fallbackProducts.find(p => p.id === slug || p.slug === slug);
            return found ? { success: true, product: found } : { success: false, error: "Not found" };
        }

        const data = await storefrontFetch(`/products/${encodeURIComponent(slug)}`, {
            next: { tags: [`store-product-${slug}`], revalidate: 60 },
        });

        return data;
    } catch (error) {
        console.warn("[DEVLOMATIX_PRODUCT_DETAIL_FALLBACK]", error.message);
        const found = fallbackProducts.find(p => p.id === slug || p.slug === slug);
        return found ? { success: true, product: found, fallback: true } : { success: false, error: "Not found" };
    }
}

/**
 * Validate a promotional coupon code
 */
export async function validateStoreCoupon(code, subtotal) {
    return storefrontFetch("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code, subtotal }),
        cache: "no-store",
    });
}

/**
 * Sync active cart with backend for abandoned cart tracking
 */
export async function syncStoreCart(cartData) {
    if (!STORE_API_KEY) return { success: false, skip: true };

    try {
        return await storefrontFetch("/cart/sync", {
            method: "POST",
            body: JSON.stringify(cartData),
            cache: "no-store",
        });
    } catch (error) {
        return { success: false, skip: true, error: error.message };
    }
}

/**
 * Place a customer order
 */
export async function placeStoreOrder(orderPayload) {
    return storefrontFetch("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload),
        cache: "no-store",
    });
}

/**
 * Track an order by order ID or external tracking number
 */
export async function trackStoreOrder(orderId) {
    return storefrontFetch(`/orders/${encodeURIComponent(orderId)}`, {
        cache: "no-store",
    });
}

/**
 * Internal helper to filter fallback products if backend is disconnected
 */
function filterFallbackProducts(filters = {}) {
    let list = [...fallbackProducts];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    if (filters.category && filters.category !== "all") {
        const target = filters.category.toLowerCase().replace(/-/g, " ");
        list = list.filter(p => {
            const pCat = (p.category || "").toLowerCase().replace(/-/g, " ");
            return pCat === target;
        });
    }

    if (filters.maxPrice) {
        list = list.filter(p => (p.priceNum || p.price) <= filters.maxPrice);
    }

    if (filters.sort) {
        switch (filters.sort) {
            case "price-asc":
                list.sort((a, b) => (a.priceNum || a.price) - (b.priceNum || b.price));
                break;
            case "price-desc":
                list.sort((a, b) => (b.priceNum || b.price) - (a.priceNum || a.price));
                break;
            case "rating":
                list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
                break;
        }
    }

    return {
        success: true,
        fallback: true,
        products: list,
        pagination: {
            page: filters.page || 1,
            limit: filters.limit || list.length,
            total: list.length,
            totalPages: 1,
        },
    };
}
