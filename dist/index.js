"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//https://posdesweb.igormaldonado.com.br/api/allowedCategory?category=moda
const fs = require('fs/promises');
//const axios = require('axios');
const path = require('path');
function validarCategoriasProds() {
    return __awaiter(this, void 0, void 0, function* () {
        const produtosCaminho = path.join(__dirname, '../produtcts.json');
        const produtosData = yield fs.readFile(produtosCaminho, 'utf-8');
        const produtos = JSON.parse(produtosData);
        return produtos;
    });
}
validarCategoriasProds().then(produtos => {
    console.log(produtos);
});
