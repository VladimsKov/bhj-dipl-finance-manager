/**
* Класс AsyncForm управляет всеми формами
* приложения, которые не должны быть отправлены с
* перезагрузкой страницы. Вместо этого данные
* с таких форм собираются и передаются в метод onSubmit
* для последующей обработки
* */
class AsyncForm {
  /**
  * Если переданный элемент не существует,
  * необходимо выкинуть ошибку.
  * Сохраняет переданный элемент и регистрирует события
  * через registerEvents()
  * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw  new Error('Элемент пуст')
    }
    this.registerEvents();		
  }
  
  /**
  * Необходимо запретить отправку формы и в момент отправки
  * вызывает метод submit()
  * */
  registerEvents() {
    
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      
      this.submit(e.currentTarget);
    })    
  }
  
  /**
  * Преобразует данные формы в объект вида
  * {
  *  'название поля формы 1': 'значение поля формы 1',
  *  'название поля формы 2': 'значение поля формы 2'
  * }
  * */
  getData() {
    const formData = new FormData(this.element);
    const data = {};
    for(let [name, value] of formData) {
      //console.log(`data to insert: ${name} : ${value}`);
      data[name] = value;
      //console.log(`$inserted in obj data: ${data[name]}`);
    }
    //console.log(`In getData() res:\n ${data.name}`);
    return data;   
  }
  
  onSubmit(options){
    
  }
  
  /**
  * Вызывает метод onSubmit и передаёт туда
  * данные, полученные из метода getData()
  * */
  submit(form) {
    const data = this.getData();
    console.log(`returned data in AsyncForm.js, submit(): ${data.email}`);
    console.log(form);
    switch(form.id) {
      case 'register-form': {
        App.forms.register.onSubmit(data);
      }
      break;
      case 'login-form': {
        App.forms.login.onSubmit(data);
      }
    }    
  }
}