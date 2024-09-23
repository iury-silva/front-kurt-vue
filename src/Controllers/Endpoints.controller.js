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
                router.push('Dashboard');
            }
        })
        .catch((error) => {
            util.setNotification('error', error.response.data.message)
        });
    }
}


export default endpoints;