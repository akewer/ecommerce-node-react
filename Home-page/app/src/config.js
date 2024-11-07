const config = {
    apiPath: 'http://localhost:3001',
    header: () => {
        return {
            headers: {
                Authorization : localStorage.getItem('token')
            }
        }
    }
}

export default config;