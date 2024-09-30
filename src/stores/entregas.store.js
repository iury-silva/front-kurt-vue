import { defineStore } from "pinia";
import endpoints from '@/Controllers/Endpoints.controller';

export const useEntregaStore = defineStore({
    id: "entrega",
    state: () => ({
        entregas: [],
    }),
    getters: {
    },
    actions: {
        async clearEntregas() {
            this.entregas = [];
        },
        async getentregas() {
            this.entregas = await endpoints.getEntregas();
            return this.entregas;
        },
        async uploadFile(file) {
            return await endpoints.submitFile(file);
        },
        async downloadFile(base64File, fileName = 'download') {
            try {
                // Decode the base64 string
                const binaryString = window.atob(base64File)
                const len = binaryString.length
                const bytes = new Uint8Array(len)
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i)
                }

                // Create Blob from the decoded data
                const blob = new Blob([bytes.buffer], { type: 'application/octet-stream' })

                // Create download link
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()

                // Clean up
                link.remove()
                window.URL.revokeObjectURL(url)
            } catch (error) {
                console.error('Error downloading file:', error)
                throw error
            }
        }
    },
});
