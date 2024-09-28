import api from '@/api/index';
import util from './Util.controller';
import storageController from './Storage.controller';
import router from '@/router'; 
import { useUserStore } from '@/stores/user.store'

const endpoints = {
    
    fazerLogin(dados){
        const userStore = useUserStore()

        if(dados.email == '' || dados.senha == '' || !dados.email || !dados.senha){
            util.setNotification('info', 'Complete todos os dados para efetuar o Login!')
            return
        }

        api.post('/auth/login', { email: dados.email, senha: dados.senha })
        .then((response) => {
            if(response.data){
                storageController.setLocal('token', response.data.access_token);
                storageController.setLocal('session', response.data.user);
                util.setNotification('success', 'Login Efetuado com sucesso!');
                userStore.setUser(response.data.user);
                router.push({ name: 'Dashboard' });
            }
        })
        .catch((error) => {
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

        return await api.post('professores/create', { nome: dados.nome, email: dados.email, departamento: dados.departamento })
        .then((response) => {
            if(response.data){
                util.setNotification('success', 'Professor cadastrado com sucesso!');
                return true;
            }
        })
        .catch((error) => {
            util.setNotification('error', error.response.data.message);
            return false;
        });
    }
}


export default endpoints;