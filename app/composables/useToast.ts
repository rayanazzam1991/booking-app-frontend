import {toast} from "vue-sonner";

export function useToast(){
    const successToast = (msg : string)=>{
        toast.success(msg,{
            style: {
                '--normal-bg': 'var(--background)',
                '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
                '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
            }
        })
    }
    const errorToast = (msg : string)=>{
        toast.error(msg, {
            style: {
                '--normal-bg':
                    'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
                '--normal-text': 'var(--color-white)',
                '--normal-border': 'transparent'
            }
        })
    }
    return {
        successToast,
        errorToast
    }
}
