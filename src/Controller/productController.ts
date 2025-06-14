const path = require('path');
const fs = require('fs/promises');

import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoPermitido } from '../Interface/types';
import * as databaseService from '../database/databaseService';
import JwtService from '../Autenticat/generateToken'; // ajuste o caminho se estiver em outro lugar


export const getAllProduts = async () => {
  return await databaseService.retornaProcessed();
};

export const getProductById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const produto = await databaseService.buscaProdutoPorId(id.toString());
  if (!produto) {
    return reply.code(404).send({ error: 'Item não encontrado' });
  }

  return produto;
};

export const postNewProduct = async (request: FastifyRequest, reply: FastifyReply) => {
  const newProduct = request.body as Omit<ProdutoPermitido, 'id'>;

  if (!newProduct.name || !newProduct.pictureUrl) {
    return reply.code(400).send({ error: 'Body inválido' });
  }

  // Busca o maior ID atual na tabela processed
  const produtos = await databaseService.retornaProcessed();
  const existingIds = produtos.map(p => parseInt(p.id, 10));
  
  // Obtém o próximo ID a ser usado, garantindo que seja único
  let newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  const novoProduto: ProdutoPermitido = {
    id: newId.toString(),
    name: newProduct.name,
    pictureUrl: newProduct.pictureUrl,
  };

  try {
    await databaseService.insereProduto(novoProduto);
    return reply.status(201).send(novoProduto);
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    return reply.code(500).send({ error: 'Erro ao inserir produto' });
  }
};

export const updateProduct = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const body = request.body as Omit<ProdutoPermitido, 'id'>;

  const produto = await databaseService.buscaProdutoPorId(id);
  if (!produto) {
    return reply.code(404).send({ error: 'Item não encontrado' });
  }

  await databaseService.atualizaProduto({ id, name: body.name, pictureUrl: body.pictureUrl });

  return reply.code(204).send('Produto atualizado');
};

export const updateImageProduct = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const produto = await databaseService.buscaProdutoPorId(id);

  if (!produto) {
    return reply.code(404).send({ error: 'Item não encontrado' });
  }

  const data: any = await request.file();

  const extension = path.extname(data.filename).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

  if (!imageExtensions.includes(extension)) {
    return reply.code(400).send({ error: 'Imagem inválida' });
  }

  const caminhoImagem = path.join(__dirname, '../Img', `${id}${extension}`);

  try {
    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(caminhoImagem);
      data.file.pipe(stream);
      data.file.on('end', resolve);
      data.file.on('error', reject);
    });

    return reply.code(204).send('Imagem atualizada');
  } catch (err) {
    console.error('Erro ao salvar imagem:', err);
    return reply.code(500).send({ error: 'Erro ao salvar imagem' });
  }
};

export const deleteProductById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  const produto = await databaseService.buscaProdutoPorId(id);
  if (!produto) {
    return reply.code(404).send({ error: 'Item não encontrado' });
  }

  await databaseService.removeProdutoPorId(id);
  return reply.code(204).send();
};

export const getNewTokenJWT = async (request: FastifyRequest, reply: FastifyReply) => {
  const jwtService = new JwtService();

  const payload = {
    userId: 123,
    email: 'usuario@teste.com',
    role: 'user',
    permissions: ['read', 'write']
  };

  const token = jwtService.generateToken(payload);

  return reply.send({ token });
};