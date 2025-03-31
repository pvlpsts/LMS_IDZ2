document.addEventListener("DOMContentLoaded", function () {
	createTable(movies, 'list');
	setSortSelects(movies[0], document.getElementById('sort'));
})

// формирование полей элемента списка с заданным текстом и значением

let createOption = (str, val) => {
	let item = document.createElement('option');
	item.text = str;
	item.value = val;
	return item;
}

// формирование поля со списком 
// параметры – массив со значениями элементов списка и элемент select

let setSortSelect = (arr, sortSelect) => {

	// создаем OPTION Нет и добавляем ее в SELECT
	sortSelect.append(createOption('Нет', 0));

	// перебираем все ключи переданного элемента массива данных
	for (let i in arr) {
		// создаем OPTION из очередного ключа и добавляем в SELECT
		// значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция Нет
		sortSelect.append(createOption(arr[i], Number(i) + 1));
	}
}

//  формируем поля со списком для многоуровневой сортировки
let setSortSelects = (data, dataForm) => {
	const headers = Object.keys(data);
	const selects = dataForm.querySelectorAll('select');

	// Заполняем только первый select
	selects[0].innerHTML = '';
	selects[0].appendChild(createOption('Нет', '0'));
	headers.forEach((header, index) => {
		selects[0].appendChild(createOption(header, String(index + 1)));
	});

	// Остальные select оставляем пустыми
	for (let i = 1; i < selects.length; i++) {
		selects[i].innerHTML = '';
		selects[i].appendChild(createOption('Нет', '0'));
		selects[i].disabled = true;
	}
};
// настраиваем поле для следующего уровня сортировки
let changeNextSelect = (nextSelectId, curSelect) => {
	const nextSelect = document.getElementById(nextSelectId);
	const form = curSelect.form;
	const allSelects = Array.from(form.querySelectorAll('select'));

	// Если выбрано "Нет" - отключаем следующие select
	if (curSelect.value === '0') {
		const currentIndex = allSelects.indexOf(curSelect);
		for (let i = currentIndex + 1; i < allSelects.length; i++) {
			allSelects[i].innerHTML = '';
			allSelects[i].appendChild(createOption('Нет', '0'));
			allSelects[i].disabled = true;
		}
		return;
	}

	// Получаем список всех доступных полей
	const firstSelect = allSelects[0];
	const allOptions = Array.from(firstSelect.options)
		.filter(opt => opt.value !== '0')
		.map(opt => ({ text: opt.text, value: opt.value }));

	// Собираем уже использованные поля
	const usedOptions = new Set();
	allSelects.forEach(select => {
		if (select.value !== '0') {
			usedOptions.add(select.value);
		}
	});

	// Заполняем следующий select
	nextSelect.innerHTML = '';
	nextSelect.appendChild(createOption('Нет', '0'));

	// Добавляем только неиспользованные варианты
	allOptions.forEach(option => {
		if (!usedOptions.has(option.value)) {
			nextSelect.appendChild(createOption(option.text, option.value));
		}
	});

	nextSelect.disabled = nextSelect.options.length <= 1;
	if (nextSelect.disabled) {
		nextSelect.value = '0';
	} else {
		nextSelect.disabled = false;
	}

	// Сбрасываем все последующие select
	const currentIndex = allSelects.indexOf(curSelect);
	for (let i = currentIndex + 2; i < allSelects.length; i++) {
		allSelects[i].innerHTML = '';
		allSelects[i].appendChild(createOption('Нет', '0'));
		allSelects[i].disabled = true;
	}
};