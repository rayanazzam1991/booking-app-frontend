import type {H3Event} from 'h3';

export default cachedEventHandler(
    async (event: H3Event): Promise<any> => {
        const config = useRuntimeConfig();

        console.log("[server] fetching services from backend…");

        try {
            return await $fetch('/api/services', {
                baseURL: config.public.BASE_URL || ''
            });
        } catch (err) {
            console.error("[server] API error:", err);
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch services"
            });
        }
    },
    {
        swr: true,
        maxAge: 60,
        name: "services",
        getKey: () => "services"
    }
);
