import type {Service} from "../../shared/types/service";
import {useApi} from "../composables/useApi";
import {type HealthProfessional} from "../../shared/types/healthProfessional";
import {type ApiResponse} from "../../shared/types/api";

export const useHeatherProfessionalStore = defineStore('health-Professional', ()=>{

    const healthProfessionals = ref<HealthProfessional[]>()

    const {api} = useApi()
    async function fetchHealthProfessionals() {
        const response = await api.get<ApiResponse<HealthProfessional[]>>('api/health_professionals');
        if(response.data){
            healthProfessionals.value=response.data;
        }
        console.log("response", response)
    }

    const getHealthProfessionals = computed(()=>healthProfessionals.value)

    const reset = ()=>{
        healthProfessionals.value=[];
    }
    return {
        healthProfessionals,
        fetchHealthProfessionals,
        getHealthProfessionals,
        reset
    }
})
