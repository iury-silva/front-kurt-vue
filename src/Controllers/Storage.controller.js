const storageController = {

  setLocal(nome, dados) {
    //FUNC: setLocal(nome, dados)
    let setElement = `__${window.btoa(nome)}`;
    let output = window.btoa(
      window.encodeURIComponent(
        JSON.stringify({ session: new Date().getTime(), data: dados }),
      ),
    );

    if (["token", "session"].includes(nome)) {
      window.localStorage.setItem(setElement, output);
    } else {
      window.sessionStorage.setItem(setElement, output);
    }
  },

  getLocal(nome) {
    //FUNC: getLocal(nome)

    let getElement = `__${window.btoa(nome)}`;

    if (["token", "session"].includes(nome)) {
      if (getElement in localStorage) {
        return JSON.parse(
          window.decodeURIComponent(
            window.atob(window.localStorage.getItem(getElement)),
          ),
        ).data;
      }
    } else {
      if (getElement in sessionStorage) {
        return JSON.parse(
          window.decodeURIComponent(
            window.atob(window.sessionStorage.getItem(getElement)),
          ),
        ).data;
      }
    }

    return false;
  },

  destroyLocal() {
    //FUNC: destroyLocal()

    sessionStorage.clear();
    localStorage.clear();

    return false;
  },
};

export default storageController;