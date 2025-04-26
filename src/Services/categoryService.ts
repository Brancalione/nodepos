const axios = require('axios');

export async function CategoryAllowed(params:string) {
    try {
        const response = await axios.get(
          `https://posdesweb.igormaldonado.com.br/api/allowedCategory?category=${params}`  
        );
        return response.data.allowed === true;
    } catch (error) {
        console.error("SERVICE");
    }
    
}