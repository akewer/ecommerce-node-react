const config = {
    apiPath: 'http://localhost:3001',
    headers: ()=>{
       return {
        headers: {
            Authorization: localStorage.getItem('token') //เก็บ token ใน header
        }
       }
    }
}

export default config;