import { defineStore } from "pinia";
import endpoints from '@/Controllers/Endpoints.controller';

export const useOrientacaoStore = defineStore({
    id: "orientacao",
    state: () => ({
        orientacoes: [],
    }),
    getters: {
    },
    actions: {
        async clearOrientacoes() {
            this.orientacoes = [];
        },
        async getOrientacoes() {
            this.orientacoes = await endpoints.getAvaliacoes();
            return this.orientacoes;
        },
        async getOrientacao(idOrientacao){
            if(this.orientacoes.length == 0){
                await this.getOrientacoes()
            }
            return this.orientacoes.find(orientacao => orientacao.orientacao.id_orientacao === idOrientacao);
        },
        async postAvaliacao(avalia){
            const avaliacaoData = {
                ...avalia,
                data_avaliacao : new Date().toISOString()
              }
            return await endpoints.createAvaliacao(avaliacaoData);
        }
    },
});
