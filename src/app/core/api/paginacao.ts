import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { Pagina } from './modelos';

/** Maior página que o backend aceita (spring.data.web.pageable.max-page-size). */
export const TAMANHO_MAXIMO = 100;

/**
 * Busca a página 0 e segue pedindo as próximas, uma de cada vez, até a última; devolve tudo junto.
 * As telas filtram e buscam no navegador, então precisam da lista inteira, não da primeira página.
 */
export function todasAsPaginas<T>(
  buscar: (pagina: number) => Observable<Pagina<T>>,
): Observable<T[]> {
  return buscar(0).pipe(
    expand((atual) =>
      atual.page.number + 1 < atual.page.totalPages ? buscar(atual.page.number + 1) : EMPTY,
    ),
    reduce((itens: T[], atual) => itens.concat(atual.content), []),
  );
}
