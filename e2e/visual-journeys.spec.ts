import { expect, test } from '@playwright/test';
import { gotoAndWaitForHydration } from './helpers/hydration';

test('cliente: consulta estados, valida formulário e retorna à lista demonstrativa', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/cliente');
  await page.getByText('Estados de demonstração', { exact: true }).click();
  const scenario = page.getByLabel('Cenário da listagem');
  await scenario.selectOption('loading');
  await expect(page.getByRole('status')).toHaveText('Carregando demonstração…');
  await scenario.selectOption('empty');
  await expect(page.getByRole('heading', { name: 'Nenhum chamado neste exemplo' })).toBeVisible();
  await page.getByRole('button', { name: 'Voltar aos dados de exemplo' }).click();
  await page.getByRole('link', { name: 'Abrir chamado' }).first().click();
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(page.getByLabel('Título do chamado')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Título do chamado').fill('Falha na iluminação do corredor');
  await page
    .getByLabel('Descrição do problema')
    .fill('As luminárias do corredor deixaram de funcionar durante o expediente.');
  await page.getByLabel('Local do atendimento').fill('Corredor · 2º andar');
  await page.getByRole('button', { name: 'Enviar solicitação' }).click();
  await expect(
    page.getByRole('region', { name: 'Solicitação demonstrativa concluída' }),
  ).toBeFocused();
  await expect(page.locator('main')).toContainText('Nenhum chamado foi criado');
  await page.getByRole('button', { name: 'Testar outra solicitação' }).click();
  await expect(page.getByLabel('Título do chamado')).toHaveValue('');
});

test('técnico: consulta evidências, alterna prévias e conclui o atendimento fictício', async ({
  page,
}) => {
  await gotoAndWaitForHydration(page, '/app/tecnico/chamados/1042');
  const trigger = page.getByRole('button', { name: 'Ampliar IMG_0412.jpg, estado DISPONÍVEL' });
  await trigger.click();
  const gallery = page.getByRole('dialog', { name: 'Prévia da evidência' });
  await gallery.getByRole('button', { name: 'Próxima evidência' }).click();
  await expect(gallery).toContainText('Miniatura sendo preparada');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Concluir atendimento' }).click();
  const dialog = page.getByRole('dialog', { name: 'Concluir este atendimento?' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Confirmar conclusão' }).click();
  await expect(page.getByText('Atendimento concluído no exemplo', { exact: true })).toBeVisible();
});

test('gestor: alterna estados de notificações, filtra e simula exportação sem escrita', async ({
  page,
}) => {
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET' || ['fetch', 'xhr'].includes(request.resourceType()))
      writes.push(request.url());
  });
  await gotoAndWaitForHydration(page, '/app/gestor/relatorios');
  await page.getByRole('button', { name: /^Notificações de demonstração/ }).click();
  const panel = page.getByRole('region', { name: 'Notificações de demonstração' });
  await panel.getByText('Estados da demonstração', { exact: true }).click();
  const scenario = panel.getByLabel('Visualizar cenário');
  await scenario.selectOption('error');
  await expect(panel.getByRole('alert')).toContainText('Não foi possível mostrar');
  await panel.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.keyboard.press('Escape');
  await page.getByLabel('Cliente', { exact: true }).selectOption('Edifício Aurora');
  await page.getByLabel('Técnico', { exact: true }).selectOption('Rafael Costa');
  await expect(page.getByRole('status')).toContainText('10 chamados');
  await page.getByRole('button', { name: 'Exportar PDF', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Exportação de demonstração' });
  await expect(dialog.getByRole('status')).toContainText('Preparando PDF');
  await dialog.getByRole('button', { name: 'Concluir simulação' }).click();
  await expect(dialog.getByRole('status')).toContainText('Nenhum arquivo foi gerado');
  await page.keyboard.press('Escape');
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});
