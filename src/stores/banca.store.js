import { defineStore } from "pinia";
import BancaController from "@/Controllers/Banca/Banca.controller";

export const useBancaStore = defineStore({
    id: "banca",
    state: () => ({
        bancas: [],
    }),
    getters: {
        getBanca: (state) => state.bancas,
    },
    actions: {
        getBancas() {
            BancaController.getBancas().then((response) => {
                this.bancas = response;
            });
        }
    },
});
