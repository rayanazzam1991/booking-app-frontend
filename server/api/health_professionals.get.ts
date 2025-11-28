import {H3Event} from "h3";

export default cachedEventHandler(
    async (event : H3Event):Promise<any>=>{
        const config = useRuntimeConfig();

        console.log("[server] fetching health_professionals from backend…");
        try{
            return  await $fetch('api/health_professionals',{
                baseURL : config.public.BASE_URL || ''
            })
        }catch(err){
            console.error("[server] API error:", err);
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch services"
            });
        }


},{
        swr:true,
        maxAge:1,
        staleMaxAge:-1,
        name: "health_professional",
        getKey:()=>'health_professional',
    }
)
