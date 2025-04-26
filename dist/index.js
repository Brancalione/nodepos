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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs/promises');
const path = require('path');
const categoryService_1 = require("./Services/categoryService");
function validarCategoriasProds() {
    return __awaiter(this, void 0, void 0, function* () {
        const produtosCaminho = path.join(__dirname, '../produtcts.json');
        const produtosData = yield fs.readFile(produtosCaminho, 'utf-8');
        const produtos = JSON.parse(produtosData);
        const listaPermitida = [];
        yield Promise.all(produtos.map((produto) => __awaiter(this, void 0, void 0, function* () {
            const permitido = yield (0, categoryService_1.CategoryAllowed)(produto.category);
            if (permitido) {
                listaPermitida.push({
                    id: produto.id,
                    name: produto.name
                });
            }
        })));
        // Define o caminho até a raiz do projeto
        const caminhoArquivo = path.resolve(__dirname, '..', 'processed.json');
        // Converte a lista para uma string JSON
        const jsonString = JSON.stringify(listaPermitida, null, 2); // o `2` deixa o arquivo formatadinho
        // Escreve o arquivo
        fs.writeFile(caminhoArquivo, jsonString, 'utf-8');
    });
}
validarCategoriasProds();
