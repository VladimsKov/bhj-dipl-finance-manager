/**
* Класс User управляет авторизацией, выходом и
* регистрацией пользователя из приложения
* Имеет свойство URL, равное '/user'.
* */
class User {
  /**
  * Устанавливает текущего пользователя в
  * локальном хранилище.
  * */
  static URL = '/user';
  
  static setCurrent(user) {
    localStorage.user = JSON.stringify({
      id: user.id,
      name: user.name
    })    
  }
  
  /**
  * Удаляет информацию об авторизованном
  * пользователе из локального хранилища.
  * */
  static unsetCurrent() {    
    localStorage.removeItem('user');
  }
  
  /**
  * Возвращает текущего авторизованного пользователя
  * из локального хранилища
  * */
  static current() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    return currentUser;
  }
  
  /**
  * Получает информацию о текущем
  * авторизованном пользователе.
  * */
  static fetch(callback) {
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      responseType: 'json',
      //data,
      callback(err, response) {
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        return callback(err, response);
      }      
    })
  }
  
  /**
  * Производит попытку авторизации.
  * После успешной авторизации необходимо
  * сохранить пользователя через метод
  * User.setCurrent.
  * */
  static login(data,callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
          App.setState('user-logged');
        }
        return callback(err, response);
      }
    });
  }
  
  /**
  * Производит попытку регистрации пользователя.
  * После успешной авторизации необходимо
  * сохранить пользователя через метод
  * User.setCurrent.
  * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
          App.setState('user-logged');
        }
        return callback(err, response);        
      }      
    });          
  }
  
  /**
  * Производит выход из приложения. После успешного
  * выхода необходимо вызвать метод User.unsetCurrent
  * */
  static logout(callback) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      callback(err, response) {
        if (response && response.success) {
          User.unsetCurrent();
          App.setState('init');
          App.widgets.accounts.lastAccountID = '';
          App.pages.transactions.lastOptions = '';          
        }
        return callback(err, response);
      }      
    })
  }
}
