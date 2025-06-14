import { getProductById } from '../Controller/productController';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as databaseService from '../database/databaseService';

jest.mock('../database/databaseService');

describe('getProductById', () => {
  const mockReply = (): FastifyReply => {
    const reply: Partial<FastifyReply> = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    return reply as FastifyReply;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o produto quando encontrado', async () => {
    const fakeProduct = { id: '1', nome: 'Produto Teste' };
    (databaseService.buscaProdutoPorId as jest.Mock).mockResolvedValue(fakeProduct);

    const request = {
      params: { id: '1' }
    } as unknown as FastifyRequest;

    const reply = mockReply();

    const result = await getProductById(request, reply);

    console.log(result)
    console.log(fakeProduct)
    expect(databaseService.buscaProdutoPorId).toHaveBeenCalledWith('1');
    expect(result).toEqual(fakeProduct);
    expect(reply.code).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it('deve retornar 404 se o produto não for encontrado', async () => {
    (databaseService.buscaProdutoPorId as jest.Mock).mockResolvedValue(null);

    const request = {
      params: { id: '99' }
    } as unknown as FastifyRequest;

    const reply = mockReply();

    await getProductById(request, reply);

    expect(databaseService.buscaProdutoPorId).toHaveBeenCalledWith('99');
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Item não encontrado' });
  });
});
