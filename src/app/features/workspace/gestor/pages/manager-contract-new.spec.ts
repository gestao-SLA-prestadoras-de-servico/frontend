import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CadastroApi } from '@app/core/api/cadastro.api';
import { renderComponent, resetTestEnvironment, stubDialogElement } from '@testing/helpers';
import { ManagerContractNew } from './manager-contract-new';

const contrato = {
  id: 'k1',
  clienteId: 'c1',
  codigo: 'CT-1',
  inicioVigencia: '2026-01-01',
  fimVigencia: '2026-12-31',
  politicaId: null,
};

describe('ManagerContractNew', () => {
  afterEach(() => resetTestEnvironment());

  it('retries only the policy link after the contract was created but the link failed', async () => {
    stubDialogElement();
    const api = {
      clientes: vi.fn(() =>
        of([
          {
            id: 'c1',
            razaoSocial: 'ACME',
            emailContato: 'a@b.com',
            ativo: true,
            version: 0,
            endereco: {
              logradouro: 'R',
              numero: '1',
              bairro: 'B',
              cidade: 'C',
              uf: 'CE',
              cep: '60000000',
            },
          },
        ]),
      ),
      politicas: vi.fn(() => of([{ id: 'p1', nome: 'Padrão', versaoAtual: { numero: 1 } }])),
      criarContrato: vi.fn(() => of(contrato)),
      vincularPolitica: vi
        .fn()
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 503 })))
        .mockReturnValueOnce(of({ ...contrato, politicaId: 'p1' })),
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CadastroApi, useValue: api }],
    });
    const { fixture } = await renderComponent(ManagerContractNew);
    await fixture.whenStable();
    const page = fixture.componentInstance as unknown as {
      form: ManagerContractNew['form'];
      confirmDraft(): void;
      pending(): unknown;
      created(): unknown;
    };
    page.form.setValue({
      code: 'CT-1',
      companyId: 'c1',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      policyId: 'p1',
    });
    fixture.detectChanges();

    page.confirmDraft();
    expect(api.criarContrato).toHaveBeenCalledOnce();
    expect(page.pending()).toEqual(contrato);
    expect(page.form.controls.code.disabled).toBe(true);
    expect(page.created()).toBeNull();

    page.confirmDraft();
    expect(api.criarContrato).toHaveBeenCalledOnce();
    expect(api.vincularPolitica).toHaveBeenCalledTimes(2);
    expect(api.vincularPolitica).toHaveBeenLastCalledWith('k1', 'p1');
    expect(page.pending()).toBeNull();
    expect(page.created()).toMatchObject({ code: 'CT-1', policyId: 'p1' });
    fixture.destroy();
  });
});
