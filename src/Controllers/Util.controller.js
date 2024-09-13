import { useToast } from 'primevue/usetoast';

const util = {
    $toast: false,

    setInitial(toast){
        this.$toast = toast
    },

    setNotification(type, text, subtext = '', time = 4000){
        this.$toast.add({
            severity: type,  // Tipos: 'success', 'info', 'warn', 'error'
            summary: text,
            detail: subtext,
            life: time  
          });
        return
    }

}

export default util;

