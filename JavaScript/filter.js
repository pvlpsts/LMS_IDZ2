// устанавливаем соответствие между полями формы и столбцами таблицы
let correspond = {
	"Название": "moviename",
	"Жанр": "moviegenre",
	"Страна": "prodcountry",
	"Возрастной рейтинг": ["ageratingFrom", "ageratingTo"],
	"Год": ["yearFrom", "yearTo"],
	"Оценка": ["gradeFrom", "gradeTo"],
	"Сборы(в долларах)": ["boxofficeFrom", "boxofficeTo"]
}
let dataFilter = (dataForm) => {

	let dictFilter = {};
	// перебираем все элементы формы с фильтрами

	for (let j = 0; j < dataForm.elements.length; j++) {

		// выделяем очередной элемент формы
		let item = dataForm.elements[j];

		// получаем значение элемента
		let valInput = item.value;

		// если поле типа text - приводим его значение к нижнему регистру
		if (item.type == "text") {
			valInput = valInput.toLowerCase();
		}
		/* САМОСТОЯТЕЛЬНО обработать значения числовых полей:
		- если в поле занесено значение - преобразовать valInput к числу;
		- если поле пусто и его id включает From  - занести в valInput 
		   -бесконечность
		- если поле пусто и его id включает To  - занести в valInput 
		   +бесконечность
		*/
		else if (item.type == "number") {
			if (valInput === "") {
				if (item.id.includes("From")) {
					valInput = -Infinity;
				} else if (item.id.includes("To")) {
					valInput = Infinity;
				}
			}
			else {
				valInput = Number(valInput);
			}
		}

		// формируем очередной элемент ассоциативного массива
		dictFilter[item.id] = valInput;
	}
	return dictFilter;
}
// фильтрация таблицы
let filterTable = (data, idTable, dataForm, dataFormSort) => {
	let datafilter = dataFilter(dataForm);

	let tableFilter = data.filter(item => {
		let result = true;

		for (let key in item) {
			let val = item[key];
			let filterField = correspond[key];

			if (!filterField) continue;

			// Текстовые поля (название, жанр, страна)
			if (typeof val == 'string') {
				let filterValue = datafilter[filterField].toLowerCase();
				if (filterValue !== "") {
					val = val.toLowerCase();
					result = result && (val.indexOf(filterValue) !== -1);
				}
			}
			// Числовые поля (возрастной рейтинг, год, оценка, сборы)
			else if (typeof val == 'number') {
				// Если это диапазон (год, оценка, сборы)
				if (Array.isArray(filterField)) {
					let from = datafilter[filterField[0]];
					let to = datafilter[filterField[1]];

					if (from !== -Infinity || to !== Infinity) {
						result = result && (val >= from && val <= to);
					}
				}
			}
		}
		return result;
	});

	clearSort(idTable, data, dataForm, dataFormSort, 0);
	clearTable(idTable);
	createTable(tableFilter, idTable);
};

let clearFilter = (data, dataFormFilter, dataFormSort, idTable) => {
	clearSort(idTable, data, dataFormFilter, dataFormSort);
}