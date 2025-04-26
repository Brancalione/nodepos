//https://posdesweb.igormaldonado.com.br/api/allowedCategory?category=moda
const fs = require('fs/promises');
//const axios = require('axios');
const path = require('path');

async function validarCategoriasProds() {
    const produtosCaminho = path.join(__dirname, '../produtcts.json');
    const produtosData = await fs.readFile(produtosCaminho, 'utf-8');
    const produtos = JSON.parse(produtosData);
    return produtos

}
validarCategoriasProds().then(produtos => {
    console.log(produtos); 
});


