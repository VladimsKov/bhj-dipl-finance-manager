/**
* Класс TransactionsPage управляет
* страницей отображения доходов и
* расходов конкретного счёта
* */
class TransactionsPage {
  /**
  * Если переданный элемент не существует,
  * необходимо выкинуть ошибку.
  * Сохраняет переданный элемент и регистрирует события
  * через registerEvents()
  * */
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw  new Error('Элемент пуст')
    }    
  }
  
  /**
  * Вызывает метод render для отрисовки страницы
  * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);    
    }
  }
  
  
  /**
  * Отслеживает нажатие на кнопку удаления транзакции
  * и удаления самого счёта. Внутри обработчика пользуйтесь
  * методами TransactionsPage.removeTransaction и
  * TransactionsPage.removeAccount соответственно
  * */
  registerEvents() {
    const removeAccountButton = this.element.querySelector('.remove-account');
    removeAccountButton.addEventListener('click', () => {this.removeAccount()});
  }
  
  registerTransactionEvents() {
    const rmTransactionButtons = this.element.querySelectorAll('.transaction__remove');
    rmTransactionButtons.forEach(elem => {
      elem.addEventListener('click', () => {
        this.removeTransaction(elem.dataset.id)});
      })     
    }    
    
    /**
    * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
    * Если пользователь согласен удалить счёт, вызовите
    * Account.remove, а также TransactionsPage.clear с
    * пустыми данными для того, чтобы очистить страницу.
    * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
    * либо обновляйте только виджет со счетами и формы создания дохода и расхода
    * для обновления приложения
    * */
    removeAccount() {
      if (this.lastOptions) {
        console.log('last options:');
        console.log(this.lastOptions);
        const request = confirm('Вы действительно хотите удалить счёт?');
        if (request) {
          const callback = (err, response) => {
            console.log('ответ сервера при удалении счета:');
            console.log(response);
            if (response.success) {            
              App.update();           
            }
          }
          const id = App.widgets.accounts.lastAccountID;
          console.log(`удаляемый счет: ${id}`);
          Account.remove({id}, callback); 
        }
      }
    }
    
    /**
    * Удаляет транзакцию (доход или расход). Требует
    * подтверждеия действия (с помощью confirm()).
    * По удалению транзакции вызовите метод App.update(),
    * либо обновляйте текущую страницу (метод update) и виджет со счетами
    * */
    removeTransaction( id ) {
      const request = confirm('Вы действительно хотите удалить эту транзакцию?');
      if (request) {        
        const callback = (err, response) => {
          if (response.success) {            
            App.update();           
          }
        }
        Transaction.remove({id}, callback);        
      }
    }
    
    /**
    * С помощью Account.get() получает название счёта и отображает
    * его через TransactionsPage.renderTitle.
    * Получает список Transaction.list и полученные данные передаёт
    * в TransactionsPage.renderTransactions()
    * */
    render(options) {
      if (options) {
        this.lastOptions = options;
        const callback = (err, response) => {
          if (response.success) {
            //вывод названия счета
            let accountElem, accountName;
            if (response.data.length) {//id от сервера, если есть транзакции 
              const accountID = response.data[0].account_id;         
              accountElem = App.widgets.accounts.element
              .querySelector(`[data-id="${accountID}"]`);                                         
            } else { //id счета из сохраненного ранее свойства
              accountElem = App.widgets.accounts.element
              .querySelector(`[data-id="${App.widgets.accounts.lastAccountID}"]`);              
            }
            if (accountElem) {
              accountName = accountElem.querySelector('a').firstElementChild.innerText;
              this.renderTitle(accountName);
            }              
            this.renderTransactions(response.data);          
          }
        }
        this.clear();        
        Transaction.list(options, callback);        
      };        
    }
    
    /**
    * Очищает страницу. Вызывает
    * TransactionsPage.renderTransactions() с пустым массивом.
    * Устанавливает заголовок: «Название счёта»
    * */
    clear() {
      const container = this.element.querySelector('.content');
      Array.from(container.children).forEach(elem => {
        elem.remove();
      });
      this.renderTransactions([]);
      this.renderTitle('Название счета');
    }
    
    /**
    * Устанавливает заголовок в элемент .content-title
    * */
    renderTitle(name){
      const accountTitle = this.element.querySelector('.content-title');
      accountTitle.innerText = name;
      
    }
    
    /**
    * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
    * в формат «10 марта 2019 г. в 03:20»
    * */
    formatDate(date) {
      const year = date.slice(0, 4);
      const day = date.slice(8, 10);
      const time = date.slice(11, 16);
      let month = date.slice(5, 7);
      switch (month) {
        case '01': month = 'января';
        break;
        case '02': month = 'февраля';
        break;
        case '03': month = 'марта';
        break;
        case '04': month = 'апреля';
        break;
        case '05': month = 'мая';
        break;
        case '06': month = 'июня';
        break;
        case '07': month = 'июля';
        break;
        case '08': month = 'августа';
        break;
        case '09': month = 'сентября';
        break;
        case '10': month = 'октября';
        break;
        case '11': month = 'ноября';
        break;
        case '12': month = 'декабря';
      }
      return day + ' ' + month + ' ' + year + ' ' + 'г.' + ' ' + 'в' + ' ' + time; 
    }
    
    /**
    * Формирует HTML-код транзакции (дохода или расхода).
    * item - объект с информацией о транзакции
    * */
    getTransactionHTML(item){
      const date = this.formatDate(item.created_at);
      let itemType = 'income';
      if (item.type != 'income') {
        itemType = 'expense';
      }
      return `<div class="transaction transaction_${itemType} row">
      <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
      <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
      <h4 class="transaction__title">${item.name}</h4>
      <!-- дата -->
      <div class="transaction__date">${date}</div>
      </div>
      </div>
      <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
      ${item.sum} <span class="currency">₽</span>
      </div>
      </div>
      <div class="col-md-2 transaction__controls">
      <!-- в data-id нужно поместить id -->
      <button class="btn btn-danger transaction__remove" data-id=${item.id}>
      <i class="fa fa-trash"></i>  
      </button>
      </div>
      </div>`
    }
    
    /**
    * Отрисовывает список транзакций на странице
    * используя getTransactionHTML
    * */
    renderTransactions(data){
      const container = this.element.querySelector('.content');
      if (data.length) {
        for (let elem of data) {
          container.insertAdjacentHTML('beforeEnd', this.getTransactionHTML(elem));
        }
      } 
      this.registerTransactionEvents();
    }
  }