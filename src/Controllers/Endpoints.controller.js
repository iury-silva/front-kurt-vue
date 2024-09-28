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
                    router.push({ name: 'Dashboard' });
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
                    util.setNotification('success', 'Password recovery email sent successfully!');
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
    }
}

export default endpoints;
