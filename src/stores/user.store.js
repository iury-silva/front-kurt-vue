import { defineStore } from "pinia";
import storageController from '@/Controllers/Storage.controller';
import util from '@/Controllers/Util.controller';
import router from '@/router'; 

export const useUserStore = defineStore({
    id: "user",
    state: () => ({
        user: false,
    }),
    getters: {
        getUser: (state) => state.user,
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        async logout() {
            this.user = false;
            storageController.destroyLocal()
            util.setNotification('info', 'Sessão finalizada');
            router.push('/');
        },
        async getUserData() {
            if (this.user) {
                return this.user
            } else {
                return storageController.getLocal('session');
            }
        },
    },
});