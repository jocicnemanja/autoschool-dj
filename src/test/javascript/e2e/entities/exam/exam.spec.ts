import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ExamComponentsPage, ExamDeleteDialog, ExamUpdatePage } from './exam.page-object';

const expect = chai.expect;

describe('Exam e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let examComponentsPage: ExamComponentsPage;
  let examUpdatePage: ExamUpdatePage;
  let examDeleteDialog: ExamDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Exams', async () => {
    await navBarPage.goToEntity('exam');
    examComponentsPage = new ExamComponentsPage();
    await browser.wait(ec.visibilityOf(examComponentsPage.title), 5000);
    expect(await examComponentsPage.getTitle()).to.eq('autoschoolNewApp.exam.home.title');
    await browser.wait(ec.or(ec.visibilityOf(examComponentsPage.entities), ec.visibilityOf(examComponentsPage.noResult)), 1000);
  });

  it('should load create Exam page', async () => {
    await examComponentsPage.clickOnCreateButton();
    examUpdatePage = new ExamUpdatePage();
    expect(await examUpdatePage.getPageTitle()).to.eq('autoschoolNewApp.exam.home.createOrEditLabel');
    await examUpdatePage.cancel();
  });

  it('should create and save Exams', async () => {
    const nbButtonsBeforeCreate = await examComponentsPage.countDeleteButtons();

    await examComponentsPage.clickOnCreateButton();

    await promise.all([
      examUpdatePage.setTypeInput('type'),
      examUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      examUpdatePage.studentSelectLastOption(),
    ]);

    expect(await examUpdatePage.getTypeInput()).to.eq('type', 'Expected Type value to be equals to type');
    expect(await examUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');

    await examUpdatePage.save();
    expect(await examUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await examComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Exam', async () => {
    const nbButtonsBeforeDelete = await examComponentsPage.countDeleteButtons();
    await examComponentsPage.clickOnLastDeleteButton();

    examDeleteDialog = new ExamDeleteDialog();
    expect(await examDeleteDialog.getDialogTitle()).to.eq('autoschoolNewApp.exam.delete.question');
    await examDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(examComponentsPage.title), 5000);

    expect(await examComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
