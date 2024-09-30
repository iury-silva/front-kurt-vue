import { defineStore } from "pinia";
import BancaController from "@/Controllers/Banca/Banca.controller";
import router from '@/router';
import util from '@/Controllers/Util.controller';

export const useBancaStore = defineStore({
    id: "banca",
    state: () => ({
        bancas: [],
        orientacoesWithoutBancas: [],
        professores: [],
    }),
    getters: {
        getBanca: (state) => state.bancas,
        getOrientacoes: (state) => state.orientacoesWithoutBancas,
        getProfessores: (state) => state.professores,
    },
    actions: {
        getBancas() {
            BancaController.getBancas().then((response) => {
                this.bancas = response;
            });
        },
        getOrientacoesAction() {
            BancaController.getOrientacoesWithoutBancas().then((response) => {
                this.orientacoesWithoutBancas = response;
            });
        },
        getProfessoresAction() {
            BancaController.getProfessores().then((response) => {
                this.professores = response;
            });
        },
        createBancaAction(dados) {
            BancaController.createBanca(dados).then((response) => {
                if (response) {
                    router.push({ name: 'Bancas' });
                    util.setNotification('success', 'Banca criada com sucesso!');
                }
            });
        },
        deleteBanca(id) {
            BancaController.deleteBanca(id).then((response) => {
                if (response) {
                    this.getBancas();
                    util.setNotification('success', 'Banca deletada com sucesso!');
                }
            });
        }
    },
});
