import api from '@/api/index';
import util from './Util.controller';
import storageController from './Storage.controller';
import router from '@/router';
import { useUserStore } from '@/stores/user.store'
import { useGlobalStore } from '@/stores/globais.store'

const endpoints = {
    // fazerLogin(dados) {
    //     const userStore = useUserStore()

    //     if (dados.email == '' || dados.senha == '' || !dados.email || !dados.senha) {
    //         util.setNotification('info', 'Complete todos os dados para efetuar o Login!')
    //         return
    //     }
    //     useGlobalStore().setLoading(true)


    //     // @todo - tava bugando e nao chaamndo a rota do dahsboard dps de logar depois de implementar a tela de perfil
    //     // sei la eu

    //     api.post('/auth/login', { email: dados.email, senha: dados.senha })
    //         .then((response) => {
    //             useGlobalStore().setLoading(false)
    //             // console.log(response)
    //             if (response.data) {
    //                 storageController.setLocal('token', response.data.access_token);
    //                 storageController.setLocal('session', response.data.user);
    //                 util.setNotification('success', 'Login Efetuado com sucesso!');
    //                 userStore.setUser(response.data.user);
    //                 // console.log(userStore.user);
    //                 router.push({ name: 'Dashboard' });
    //             }
    //         })
    //         .catch((error) => {
    //             useGlobalStore().setLoading(false)
    //             util.setNotification('error', error.response.data.message)
    //         });
    // },
    async fazerLogin(dados) {
        const userStore = useUserStore()
        console.log(dados.senha)
        if (dados.email == '' || dados.senha == '' || !dados.email || !dados.senha) {
            util.setNotification('info', 'Complete todos os dados para efetuar o Login!')
            return
        }
        // useGlobalStore().setLoading(true)

        return await api.post('/auth/login', { email: dados.email, senha: dados.senha })
            .then((response) => {
                // useGlobalStore().setLoading(false)
                if (response.data) {
                    // storageController.setLocal('token', response.data.access_token);
                    // storageController.setLocal('session', response.data.user);
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('session', JSON.stringify(response.data.user));
                    util.setNotification('success', 'Login Efetuado com sucesso!');
                    userStore.setUser(response.data.user);
                    router.push({ name: 'Dashboard' });
                    return true;
                }
            })
            .catch((error) => {
                // useGlobalStore().setLoading(false)
                // util.setNotification('error', error.response.data.message[0])
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
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
                return false;
            });
    },

    async cadastraProfessor(dados) {
        if (dados.nome == '' || !dados.nome) {
            util.setNotification('info', 'Complete o nome do professor!')
            return
        }

        if (dados.email == '' || !dados.email) {
            util.setNotification('info', 'Complete o email do professor!')
            return
        }

        if (dados.departamento == '' || !dados.departamento) {
            util.setNotification('info', 'Complete o departamento do professor!')
            return
        }
        useGlobalStore().setLoading(true)

        return await api.post('professores/create', { nome: dados.nome, email: dados.email, departamento: dados.departamento })
            .then((response) => {
                useGlobalStore().setLoading(false)
                if (response.data) {
                    util.setNotification('success', 'Professor cadastrado com sucesso!');
                    return true;
                }
            })
            .catch((error) => {
                useGlobalStore().setLoading(false)
                // util.setNotification('error', error.response.data.message);
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
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
                return false;
            });
    },
    async cadastraAluno(dados) {
        if (dados.nome == '' || !dados.nome) {
            util.setNotification('info', 'Complete o nome do aluno!')
            return
        }

        if (dados.email == '' || !dados.email) {
            util.setNotification('info', 'Complete o email do aluno!')
            return
        }

        if (dados.matricula == '' || !dados.matricula) {
            util.setNotification('info', 'Complete o matrícula do aluno!')
            return
        }
        if (dados.idcurso == '' || !dados.idcurso) {
            util.setNotification('info', 'Selecione o curso do aluno!')
            return
        }
        useGlobalStore().setLoading(true)

        return await api.post('alunos/create', dados)
            .then((response) => {
                useGlobalStore().setLoading(false)
                if (response.data) {
                    util.setNotification('success', 'Aluno cadastrado com sucesso!');
                    return true;
                }
            })
            .catch((error) => {
                useGlobalStore().setLoading(false)
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
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
                return false;
            });
    },
    async transferirCoordenador(dados) {
        
        const userStore = useUserStore();

        return await api.post('/coordenadores/transfer', { idProfessorNovoCoordenador: dados })
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Coordenador transferido com sucesso!');
                    userStore.logout()
                    return true;
                }
            })
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
                return false;
            });
      },
      async atualizarPerfil(dados) {
        console.log('atualizarPerfil', dados)
        return await api.patch('/usuarios/editMyData', dados)
            .then((response) => {
                if (response.data) {
                    util.setNotification('success', 'Perfil atualizado com sucesso!');
                    // atualiza o usuário no store
                    const userStore = useUserStore();
                    console.log(response.data)
                    userStore.setUser(response.data);
                    return true;
                }
            })
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
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
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
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
                    // atualiza o usuário no store
                    const userStore = useUserStore();
                    userStore.setAvatar(response.data.avatar);
                    return true;
                }
            })
            .catch((error) => {
                // util.setNotification('error', error.response.data.message);
                return false;
            });
    }
}


export default endpoints;