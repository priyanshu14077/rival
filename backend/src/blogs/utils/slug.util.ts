/**
 * Utility to generate a slug from a title.
 * - lowercase
 * - trim
 * - remove unsafe chars
 * - replace spaces with hyphens
 * - collapse duplicate hyphens
 */
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove non-word, non-space, non-hyphen
        .replace(/[\s_]+/g, '-')    // replace spaces or underscores with hyphens
        .replace(/-+/g, '-')       // collapse duplicate hyphens
        .replace(/^-+/, '')        // trim hyphens from start
        .replace(/-+$/, '');       // trim hyphens from end
}

/**
 * Returns the base slug with a suffix if provided.
 */
export function generateSlug(title: string, suffix?: number): string {
    const base = slugify(title);
    return suffix && suffix > 1 ? `${base}-${suffix}` : base;
}
