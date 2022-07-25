/**
* Класс Sidebar отвечает за работу боковой колонки:
* кнопки скрытия/показа колонки в мобильной версии сайта
* и за кнопки меню
* */
class Sidebar {
	/**
	* Запускает initAuthLinks и initToggleButton
	* */
	static init() {
		this.initAuthLinks();
		this.initToggleButton();
	}
	
	/**
	* Отвечает за скрытие/показа боковой колонки:
	* переключает два класса для body: sidebar-open и sidebar-collapse
	* при нажатии на кнопку .sidebar-toggle
	* */
	static initToggleButton() {
		const toggleButton = document.querySelector('.sidebar-toggle');
		const body = document.querySelector('body');
		toggleButton.addEventListener('click', (e)=> {
			e.preventDefault();
			body.classList.toggle('sidebar-open');
		})
	}
	
	/**
	* При нажатии на кнопку входа, показывает окно входа
	* (через найденное в App.getModal)
	* При нажатии на кнопку регастрации показывает окно регистрации
	* При нажатии на кнопку выхода вызывает User.logout и по успешному
	* выходу устанавливает App.setState( 'init' )
	* */
	static initAuthLinks() {
		const regButton = document.querySelector('.menu-item_register');
		const loginButton = document.querySelector('.menu-item_login');
		regButton.addEventListener('click', () => {
			const modalWindow = App.getModal('register');
			modalWindow.open();
			
		});
		loginButton.addEventListener('click', () => {
			const modalWindow = App.getModal('login');
			modalWindow.open();
		});
		const logoutButton = document.querySelector('.menu-item_logout');
		logoutButton.addEventListener('click', () => {
			User.logout(callback);			
		})
	}
}