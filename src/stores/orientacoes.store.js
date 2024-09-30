import { defineStore } from "pinia";
import OrientacaoController from "@/Controllers/Orientacoes/Orientacoes.controller";
import router from '@/router';
import util from '@/Controllers/Util.controller';

export const useOrientacaoStore = defineStore({
    id: "orientacao",
    state: () => ({
        orientacoes: [],
        cronogramas: [],
        alunos: [],
        professores: [],
    }),
    getters: {
        getOrientacoes: (state) => state.orientacoes,
        getCronogramas: (state) => state.cronogramas,
        getAlunos: (state) => state.alunos,
        getProfessores: (state) => state.professores,
    },
    actions: {
        getOrientacoesAction() {
            OrientacaoController.getOrientacoes().then((response) => {
                this.orientacoes = response;
            });
        },
        getCronogramasAction() {
            OrientacaoController.getCronogramas().then((response) => {
                this.cronogramas = response;
            });
        },
        getAlunosAction() {
            OrientacaoController.getAlunos().then((response) => {
                this.alunos = response;
            });
        },
        getProfessoresAction() {
            OrientacaoController.getProfessores().then((response) => {
                this.professores = response;
            });
        },
        createOrientacaoAction(dados) {
            OrientacaoController.createOrientacao(dados).then((response) => {
                if (response) {
                    router.push({ name: 'Orientacoes' });
                    util.setNotification('success', 'Orientação criada com sucesso!');
                }
            });
        },
        deleteOrientacao(id) {
            OrientacaoController.deleteOrientacao(id).then((response) => {
                if (response) {
                    this.getOrientacoesAction();
                    util.setNotification('success', 'Orientação deletada com sucesso!');
                }
            });
        }
    },
});