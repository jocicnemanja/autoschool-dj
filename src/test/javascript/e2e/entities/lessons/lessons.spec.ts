import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LessonsComponentsPage, LessonsDeleteDialog, LessonsUpdatePage } from './lessons.page-object';

const expect = chai.expect;

describe('Lessons e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let lessonsComponentsPage: LessonsComponentsPage;
  let lessonsUpdatePage: LessonsUpdatePage;
  let lessonsDeleteDialog: LessonsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Lessons', async () => {
    await navBarPage.goToEntity('lessons');
    lessonsComponentsPage = new LessonsComponentsPage();
    await browser.wait(ec.visibilityOf(lessonsComponentsPage.title), 5000);
    expect(await lessonsComponentsPage.getTitle()).to.eq('autoschoolNewApp.lessons.home.title');
    await browser.wait(ec.or(ec.visibilityOf(lessonsComponentsPage.entities), ec.visibilityOf(lessonsComponentsPage.noResult)), 1000);
  });

  it('should load create Lessons page', async () => {
    await lessonsComponentsPage.clickOnCreateButton();
    lessonsUpdatePage = new LessonsUpdatePage();
    expect(await lessonsUpdatePage.getPageTitle()).to.eq('autoschoolNewApp.lessons.home.createOrEditLabel');
    await lessonsUpdatePage.cancel();
  });

  it('should create and save Lessons', async () => {
    const nbButtonsBeforeCreate = await lessonsComponentsPage.countDeleteButtons();

    await lessonsComponentsPage.clickOnCreateButton();

    await promise.all([
      lessonsUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      lessonsUpdatePage.setTypeInput('type'),
      lessonsUpdatePage.setAmountInput('5'),
      lessonsUpdatePage.studentSelectLastOption(),
    ]);

    expect(await lessonsUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    expect(await lessonsUpdatePage.getTypeInput()).to.eq('type', 'Expected Type value to be equals to type');
    expect(await lessonsUpdatePage.getAmountInput()).to.eq('5', 'Expected amount value to be equals to 5');

    await lessonsUpdatePage.save();
    expect(await lessonsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await lessonsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Lessons', async () => {
    const nbButtonsBeforeDelete = await lessonsComponentsPage.countDeleteButtons();
    await lessonsComponentsPage.clickOnLastDeleteButton();

    lessonsDeleteDialog = new LessonsDeleteDialog();
    expect(await lessonsDeleteDialog.getDialogTitle()).to.eq('autoschoolNewApp.lessons.delete.question');
    await lessonsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(lessonsComponentsPage.title), 5000);

    expect(await lessonsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
