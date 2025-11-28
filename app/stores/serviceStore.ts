import {type Service} from "../../shared/types/service";
import {useApi} from "../composables/useApi";
import {type ApiResponse} from "../../shared/types/api";
import {type HealthProfessional} from "../../shared/types/healthProfessional";

export const useServiceStore = defineStore('service-store', () =>{

    const services = ref<Service[]>()
    const serviceProfessionals = ref<HealthProfessional[]>()

    const {api} = useApi()

    async function fetchServices() {
        const response = await api.get<ApiResponse<Service[]>>('api/services');
        if (response.data){
            services.value = response.data
        }
        console.log("response", response)
    }

    async function fetchServiceProfessionals(serviceId : number) {
        const response = await api.get<ApiResponse<HealthProfessional[]>>(`api/services/${serviceId}/health_professionals`);
        if (response.data){
            serviceProfessionals.value = response.data
            console.log("serviceProfessionals",serviceProfessionals.value)
        }
    }

    const setServiceProfessionals  = (list :  HealthProfessional[]  | [])=>{
        serviceProfessionals.value = list
    }

    const getServices = computed(()=>services.value)
    const getServiceProfessionals = computed(()=>serviceProfessionals.value)

    return {
        services,
        serviceProfessionals,
        fetchServices,
        fetchServiceProfessionals,
        getServices,
        getServiceProfessionals,
        setServiceProfessionals
    }
})
