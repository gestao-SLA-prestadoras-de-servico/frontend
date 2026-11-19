import { firstValueFrom, of } from 'rxjs';
import { Pagina } from './modelos';
import { todasAsPaginas } from './paginacao';

const pagina = (number: number, totalPages: number, content: number[]): Pagina<number> => ({
  content,
  page: { size: 2, number, totalPages, totalElements: 5 },
});

describe('todasAsPaginas', () => {
  it('follows every page in order and concatenates the content', async () => {
    const pedidas: number[] = [];
    const paginas = [pagina(0, 3, [1, 2]), pagina(1, 3, [3, 4]), pagina(2, 3, [5])];
    const itens = await firstValueFrom(
      todasAsPaginas((n) => {
        pedidas.push(n);
        return of(paginas[n]);
      }),
    );
    expect(itens).toEqual([1, 2, 3, 4, 5]);
    expect(pedidas).toEqual([0, 1, 2]);
  });

  it('handles an empty result without asking for more pages', async () => {
    const pedidas: number[] = [];
    const itens = await firstValueFrom(
      todasAsPaginas((n) => {
        pedidas.push(n);
        return of(pagina(0, 0, []));
      }),
    );
    expect(itens).toEqual([]);
    expect(pedidas).toEqual([0]);
  });
});
