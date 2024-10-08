import api from '@/api/index';
import util from './Util.controller';
import router from '@/router';
import { useUserStore } from '@/stores/user.store';
import { useGlobalStore } from '@/stores/globais.store';

const endpoints = {
    async fazerLogin(dados) {
        const userStore = useUserStore();

        if (!dados.email || !dados.senha) {
            util.setNotification('info', 'Complete todos os dados para efetuar o Login!');
            return;
        }

        return await api.post('/auth/login', { email: dados.email, senha: dados.senha })
            .then((response) => {
                if (response.data) {
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('session', JSON.stringify(response.data.user));
                    util.setNotification('success', 'Login Efetuado com sucesso!');
                    userStore.setUser(response.data.user);
                    if(response.data.user.nivel_acesso == 'aluno'){
                        router.push({ name: 'MinhasEntregas' });
                    } else {
                        router.push({ name: 'Avaliacoes' });
                    }
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async recuperarSenha(dados) {
        return await api.post('/auth/recover', dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Senha recuperada com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async cadastraProfessor(dados) {
        if (!dados.nome || !dados.email || !dados.departamento) {
            util.setNotification('info', 'Complete todos os dados do professor!');
            return;
        }
        useGlobalStore().setLoading(true);

        return await api.post('professores/create', { nome: dados.nome, email: dados.email, departamento: dados.departamento })
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Professor cadastrado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },

    async getCursos() {
        return await api.get('cursos/getAll')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async cadastraAluno(dados) {
        if (!dados.nome || !dados.email || !dados.matricula || !dados.idcurso) {
            util.setNotification('info', 'Complete todos os dados do aluno!');
            return;
        }
        useGlobalStore().setLoading(true);

        return await api.post('alunos/create', dados)
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Aluno cadastrado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },

    async getProfessores() {
        return await api.get('/professores/getAll')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async transferirCoordenador(dados) {
        const userStore = useUserStore();

        return await api.post('/coordenadores/transfer', { idProfessorNovoCoordenador: dados })
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Coordenador transferido com sucesso!');
                    userStore.logout();
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async atualizarPerfil(dados) {
        return await api.patch('/usuarios/editMyData', dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Perfil atualizado com sucesso!');
                    const userStore = useUserStore();
                    userStore.setUser(response.data);
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async mudarSenha(dados) {
        return await api.post('/usuarios/changepassword', dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Senha alterada com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async atualizarAvatar(dados) {
        let body = {
            base64data: dados.split("base64,")[1]
        };
        return await api.post('/usuarios/setAvatar', body)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Avatar atualizado com sucesso!');
                    const userStore = useUserStore();
                    userStore.setAvatar(response.data.avatar);
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async getCronogramas(){
        return await api.get('cronogramas/getAll')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async createCronograma(dados){
        if (!dados.descricao || dados.descricao == '') {
            util.setNotification('info', 'Complete um título para o cronograma!');
            return 'validacao';
        }
        if (!dados.dataInicio || dados.dataInicio == '') {
            util.setNotification('info', 'Complete uma data de início para o cronograma!');
            return 'validacao';
        }
        if (!dados.dataFim || dados.dataFim == '') {
            util.setNotification('info', 'Complete uma data de fim para o cronograma!');
            return 'validacao';
        }
        useGlobalStore().setLoading(true);

        return await api.post('cronogramas/create', dados)
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Cronograma cadastrado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },

    async getPrazos(idcronograma){
        return await api.get('prazos/prazo_cronograma/' + idcronograma)
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async deleteCronograma(idcronograma){
        return await api.delete('cronogramas/' + idcronograma)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', response.data);
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async deletePrazo(idPrazos){
        return await api.delete('prazos/' + idPrazos)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Prazo deletado com sucesso!');
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async createPrazo(dados){
        if (!dados.data_entrega || dados.data_entrega == '') {
            util.setNotification('info', 'Complete uma data de entrega para o prazo!');
            return 'validacao';
        }
        if (!dados.data_retorno || dados.data_retorno == '') {
            util.setNotification('info', 'Complete uma data de retorno para o prazo!');
            return 'validacao';
        }
        useGlobalStore().setLoading(true);

        return await api.post('prazos/create', dados)
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Prazo cadastrado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },

    async getAvaliacoes(){
        return await api.get('entregas/getStudentSubmissions')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async createAvaliacao(dados){
        if (!dados.comentario || dados.comentario == '') {
            util.setNotification('info', 'Complete o comentário da avaliação!');
            return 'validacao';
        }
        if (!dados.nota || dados.nota == '') {
            util.setNotification('info', 'Complete a nota da avaliação!');
            return 'validacao';
        }
        useGlobalStore().setLoading(true);

        return await api.post('avaliacoes', dados)
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Avaliação cadastrada com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },

    async getEntregas(){
        return await api.get('entregas/getMySubmissions')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },

    async submitFile(dados){
        useGlobalStore().setLoading(true);

        return await api.post('entregas/submit', dados)
            .then((response) => {
                useGlobalStore().setLoading(false);
                if (response.data) {
                    util.setNotification('success', 'Arquivo enviado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                useGlobalStore().setLoading(false);
                return false;
            });
    },
    async getMyReunioes() {
        try {
            const response = await api.get('reunioes/getReunioes');
            if (response.data) {
                return response.data;
            } else {
                console.error('No data received from getMyReunioes');
                return false;
            }
        } catch (error) {
            console.error('Error fetching reunioes:', error);
            return false;
        }
    },
    async downloadReuniaoFile(idReuniao){
        let body = {
            idreuniao: idReuniao
        };
        return await api.post('reunioes/addDocumento', body)
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
    },
    async sendFile(dados) {
        console.log(dados);
        let arquivo_formatado = dados.arquivo.split("base64,")[1];

        let body = {
            idreuniao: dados.idreuniao,
            // arquivo: dados.arquivo,
            // remove the base64 header
            arquivo: arquivo_formatado,
            nome: dados.nome
        };

        try {
          const response = await api.post('reunioes/addDocumento', body);
            if (response.data) {
                util.setNotification('success', 'Arquivo enviado com sucesso!');
                return true;
            }
        }
        catch (error) {
            return false;
        }
      },
      async getMyOrientacoes(){
        return await api.get('orientacoes/getMyOrientacoes')
            .then((response) => {
                if (response.data) {
                    return response.data;
                }
            })
            .catch(() => {
                return false;
            });
      },
      async createReuniao(dados){
        // POST // reunioes/addToOrientacao
        // {
        //     "idorientacao": "908d43f4-3f6b-4ee8-9e56-cdae7fc7848b",
        //     "data_reuniao": "{% now 'iso-8601', '' %}",
        //     "descricao": "teste"
        // }

        return await api.post('reunioes/addToOrientacao', dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Reunião cadastrada com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
      },
      async deleteFile(dados){
        return await api.delete('reunioes/removeDocumento/' + dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Arquivo deletado com sucesso!');
                    return true;
                }
            })
            .catch(() => {
                return false;
            });
      }
}

export default endpoints;
