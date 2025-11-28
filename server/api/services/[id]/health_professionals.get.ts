import type {H3Event} from 'h3';

export default cachedEventHandler(
    async (event: H3Event): Promise<any> => {
        const config = useRuntimeConfig();
        const id = getRouterParam(event, 'id')
        console.log("id",id);
        console.log("[server] fetching services from backend…");

        try {
            return await $fetch(`/api/services/${id}/health_professionals`, {
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
        maxAge: 1,
        name: "services_health_professionals",
        getKey: (event) => "services_"+ getRouterParam(event, 'id')
    }
);
