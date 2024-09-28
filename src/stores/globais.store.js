import { defineStore } from "pinia";

export const useGlobalStore = defineStore({
    id: "global",
    state: () => ({
        loading: false,
    }),
    getters: {
        getLoading: (state) => state.loading,
    },
    actions: {
        setLoading(value) {
            this.loading = value;
        },
    },
});