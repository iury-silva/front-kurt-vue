import api from '@/api/index';
import util from './Util.controller';
import storageController from './Storage.controller';
import router from '@/router'; 
import { useUserStore } from '@/stores/user.store'
import { useGlobalStore } from '@/stores/globais.store'


const endpoints = {
    
    fazerLogin(dados){
        const userStore = useUserStore()

        if(dados.email == '' || dados.senha == '' || !dados.email || !dados.senha){
            util.setNotification('info', 'Complete todos os dados para efetuar o Login!')
            return
        }
        useGlobalStore().setLoading(true)

        api.post('/auth/login', { email: dados.email, senha: dados.senha })
        .then((response) => {
            useGlobalStore().setLoading(false)
            if(response.data){
                storageController.setLocal('token', response.data.access_token);
                storageController.setLocal('session', response.data.user);
                util.setNotification('success', 'Login Efetuado com sucesso!');
                userStore.setUser(response.data.user);
                router.push({ name: 'Dashboard' });
            }
        })
        .catch((error) => {
            useGlobalStore().setLoading(false)
            util.setNotification('error', error.response.data.message)
        });
    },

    async cadastraProfessor(dados){
        if(dados.nome == '' || !dados.nome){
            util.setNotification('info', 'Complete o nome do professor!')
            return
        }

        if(dados.email == '' || !dados.email){
            util.setNotification('info', 'Complete o email do professor!')
            return
        }

        if(dados.departamento == '' || !dados.departamento){
            util.setNotification('info', 'Complete o departamento do professor!')
            return
        }
        useGlobalStore().setLoading(true)

        return await api.post('professores/create', { nome: dados.nome, email: dados.email, departamento: dados.departamento })
        .then((response) => {
            useGlobalStore().setLoading(false)
            if(response.data){
                util.setNotification('success', 'Professor cadastrado com sucesso!');
                return true;
            }
        })
        .catch((error) => {
            useGlobalStore().setLoading(false)
            util.setNotification('error', error.response.data.message);
            return false;
        });
    },

    async getCursos(){
        return await api.get('cursos/getAll')
        .then((response) => {
            if(response.data){
                return response.data;
            }
        })
        .catch((error) => {
            util.setNotification('error', error.response.data.message);
            return false;
        });
    },
    async cadastraAluno(dados){
        if(dados.nome == '' || !dados.nome){
            util.setNotification('info', 'Complete o nome do aluno!')
            return
        }

        if(dados.email == '' || !dados.email){
            util.setNotification('info', 'Complete o email do aluno!')
            return
        }

        if(dados.matricula == '' || !dados.matricula){
            util.setNotification('info', 'Complete o matrícula do aluno!')
            return
        }
        if(dados.idcurso == '' || !dados.idcurso){
            util.setNotification('info', 'Selecione o curso do aluno!')
            return
        }
        useGlobalStore().setLoading(true)

        return await api.post('alunos/create', dados)
        .then((response) => {
            useGlobalStore().setLoading(false)
            if(response.data){
                util.setNotification('success', 'Aluno cadastrado com sucesso!');
                return true;
            }
        })
        .catch((error) => {
            useGlobalStore().setLoading(false)
            if(typeof error.response.data.message == 'object'){
                util.setNotification('error', error.response.data.message[0]);
            } else {
                util.setNotification('error', error.response.data.message);
            }
            return false;
        });
    },
}


export default endpoints;