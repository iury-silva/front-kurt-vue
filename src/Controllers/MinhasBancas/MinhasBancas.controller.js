import api from "@/api";

export default {
  async getMyBancas() {
    return await api.get("/bancas/getMyBancas").then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },
};