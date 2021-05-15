import { element, by, ElementFinder } from 'protractor';

export class ExamComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-exam div table .btn-danger'));
  title = element.all(by.css('jhi-exam div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ExamUpdatePage {
  pageTitle = element(by.id('jhi-exam-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  typeInput = element(by.id('field_type'));
  dateInput = element(by.id('field_date'));

  studentSelect = element(by.id('field_student'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTypeInput(type: string): Promise<void> {
    await this.typeInput.sendKeys(type);
  }

  async getTypeInput(): Promise<string> {
    return await this.typeInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async studentSelectLastOption(): Promise<void> {
    await this.studentSelect.all(by.tagName('option')).last().click();
  }

  async studentSelectOption(option: string): Promise<void> {
    await this.studentSelect.sendKeys(option);
  }

  getStudentSelect(): ElementFinder {
    return this.studentSelect;
  }

  async getStudentSelectedOption(): Promise<string> {
    return await this.studentSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ExamDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-exam-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-exam'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
