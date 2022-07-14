/**
* Основная функция для совершения запросов
* на сервер.
* */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let url = options.url;
    let requestData;
    xhr.responseType = options.responseType;
    
    if (options.method != 'GET') {
        const formData = new FormData();
        Object.entries(options.data).forEach(([key, value]) => formData.append(key, value));
        requestData = formData;
    } else {
        if (options.data) {
            url = getUrlString(options.url, options.data);
            console.log(url);  
        }             
        
    }
    
    xhr.addEventListener('load', function() {
        if (this.status == 200) {
            options.callback(null, this.response)
        } else {
            options.callback(new Error(`Ошибка ${this.status}: ${this.statusText}`));
        }
    });
    try {
        xhr.open(options.method, url);
        xhr.send(requestData);
    } 
    catch (e) {
        // перехват сетевой ошибки
        options.callback(e);
    }
};

function getUrlString(url, data) {
    const urlData = Object.entries(data);
    url += '?' + urlData[0][0] + '=' + encodeURIComponent(urlData[0][1]);
    for (let i = 1; i < urlData.length; i++) {
        url += '@' + urlData[i][0] + '=' + encodeURIComponent(urlData[i][1]);
    }
    return url;
}

function callback(err, response) {
    if (err != null) {
        return err
    } else {
        return response
    }
}
