import {useApi} from "../composables/useApi";
import {type ApiResponse} from "../../shared/types/api";

export const useAppointmentStore = defineStore('appointment-store', ()=>{

    const {directApi} = useApi()

    const config =  useRuntimeConfig().public
    async function bookAppointment(request : any) {
        console.log(`${config.BASE_API_URL}/appointment`)
        const response = await directApi.post<ApiResponse<any>>('/appointment',{
            ...request
        });
    }

    return {
        bookAppointment,
    }
})
