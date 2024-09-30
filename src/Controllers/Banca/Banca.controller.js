import api from "@/api";

export default {
  async getBancas() {
    return await api.get("/bancas/getAll").then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async getOrientacoesWithoutBancas() {
    return await api.get("/orientacoes/orientacoes-without-bancas").then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async getProfessores() {
    return await api.get("/professores/getAll").then((response) => {
      if (response.data) {
        return response.data;
      }
    });
  },

  async createBanca(dados) {
    console.log(dados);
    return await api.post("/bancas/create", dados)
      .then((response) => {
        if (response.data) {
          return true;
        }
      })
      .catch(() => {
        return false;
      });
  },

  async deleteBanca(id) {
    return await api.delete(`/bancas/${id}`)
      .then((response) => {
        if (response.data) {
          return true;
        }
      })
      .catch(() => {
        return false;
      });
  }
};