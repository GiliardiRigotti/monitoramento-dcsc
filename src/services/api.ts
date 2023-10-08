import axios from "axios";

const apiBlumenau = axios.create({
    baseURL: 'http://alertablu.blumenau.sc.gov.br'
})


apiBlumenau.defaults.headers.common["Access-Control-Allow-Origin"] = "https://alertablu.blumenau.sc.gov.br"
apiBlumenau.defaults.headers.common["Access-Control-Request-Method"] = "GET"
apiBlumenau.defaults.headers.common["Access-Control-Request-Headers"] = "Content-Type, Authorization"

export{apiBlumenau}