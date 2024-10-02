import { format } from 'date-fns';
import { defineStore } from 'pinia';
import MinhasBancasController from '@/Controllers/MinhasBancas/MinhasBancas.controller';

export const useMinhasBancasStore = defineStore({
    id: 'minhasBancas',
    state: () => ({
        minhasBancas: [],
        avaliar: {},
    }),
    getters: {
        getMinhasBancas: (state) => state.minhasBancas,
    },
    actions: {
        async getMinhasBancasAction() {
            await MinhasBancasController.getMyBancas().then((response) => {
                this.minhasBancas = response;
            });
        },
        async getMinhasBancasByIdAction(id) {
            if (!this.minhasBancas.length) {
                await this.getMinhasBancasAction();
            }
            const banca = this.minhasBancas.find((banca) => banca.id_banca === id);

            if (banca) {
                const {
                    Aluno: { usuario: { nome: nomeAluno }, usuario: { email: emailAluno }, matricula: matriculaAluno },
                    Orientacao: {
                        Professor: { usuario: { nome: nomeProfessor, email: emailProfessor } },
                        data_inicio, data_fim, Entrega: entregas, titulo_trabalho: tituloTrabalho,
                    }
                } = banca;

                const dataInicioFormatada = format(new Date(data_inicio), 'dd/MM/yyyy');
                const dataFimFormatada = format(new Date(data_fim), 'dd/MM/yyyy');

                this.avaliar = {
                    nomeAluno,
                    emailAluno,
                    nomeProfessor,
                    emailProfessor,
                    entregas,
                    tituloTrabalho,
                    matriculaAluno,
                    periodo: `${dataInicioFormatada} - ${dataFimFormatada}`
                };
            }
        },

        async createAvaliacaoAction(avaliacao, id) {
            const avaliacaoData = {
                ...avaliacao,
                data_avaliacao: new Date().toISOString(),
            };

            await MinhasBancasController.createAvaliacao(avaliacaoData);
            this.minhasBancas = [];
            await this.getMinhasBancasByIdAction(id);

        },
    },
});
