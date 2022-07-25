/**
* Класс CreateTransactionForm управляет формой
* создания новой транзакции
* */
class CreateTransactionForm extends AsyncForm {
  /**
  * Вызывает родительский конструктор и
  * метод renderAccountsList
  * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
    
  }
  
  /**
  * Получает список счетов с помощью Account.list
  * Обновляет в форме всплывающего окна выпадающий список
  * */
  renderAccountsList() {
    const currentUser = User.current();
    if (currentUser) {
      const callback = (err, response) => {
        if (response.success) {            
          const accountsList = this.element.querySelector('select');
          this.clear();      
          for (let elem of response.data) {
            accountsList.insertAdjacentHTML('beforeEnd', `<option value="${elem.id}">${elem.name}</option>`);     
          }    
        }               
      }
      Account.list({id: currentUser.id}, callback);      
    }    
  }
  //Очистка текущего списка счетов формы
  clear() {
    const accounts = this.element.querySelectorAll('option');
    accounts.forEach((elem) => {
      elem.remove();
    })
  }
  
  /**
  * Создаёт новую транзакцию (доход или расход)
  * с помощью Transaction.create. По успешному результату
  * вызывает App.update(), сбрасывает форму и закрывает окно,
  * в котором находится форма
  * */
  onSubmit(data) {
    Transaction.create(data, callback);
    App.modals.newIncome.close();
    App.modals.newExpense.close(); 
  }
}