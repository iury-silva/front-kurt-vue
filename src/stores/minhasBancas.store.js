import { defineStore } from 'pinia'
import MinhasBancasController from '@/Controllers/MinhasBancas/MinhasBancas.controller'
// import router from '@/router'
// import util from '@/Controllers/Util.controller'

export const useMinhasBancasStore = defineStore({
    id: 'minhasBancas',
    state: () => ({
        minhasBancas: [],
    }),
    getters: {
        getMinhasBancas: (state) => state.minhasBancas,
    },
    actions: {
        getMinhasBancasAction() {
            MinhasBancasController.getMyBancas().then((response) => {
                this.minhasBancas = response;
            });
        },
    },
});