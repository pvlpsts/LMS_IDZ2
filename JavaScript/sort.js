/*формируем массив для сортировки по уровням вида 
  (в нашем случае в форме два уровня сортировки):
   [
	{column: номер столбца, по которому осуществляется сортировка, 
	 order: порядок сортировки (true по убыванию, false по возрастанию)
	},
	{column: номер столбца, 
	 order: порядок сортировки
	}
   ]
*/
let createSortArr = (data) => {
	let sortArr = [];
	let sortSelects = data.getElementsByTagName('select');

	for (let i = 0; i < sortSelects.length; i++) {
		let keySort = sortSelects[i].value;
		if (keySort == 0) continue;

		let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
		sortArr.push({
			column: keySort - 1,
			order: desc
		});
	}
	return sortArr;
};
let sortTable = (idTable, data) => {
	let sortArr = createSortArr(data);

	if (sortArr.length === 0) return false;

	let table = document.getElementById(idTable);
	let rowData = Array.from(table.rows);
	rowData.shift(); // Удаляем заголовок

	// Получаем список полей таблицы для определения типов данных
	let headers = Array.from(table.rows[0].cells).map(cell => cell.innerHTML);

	rowData.sort((first, second) => {
		for (let i = 0; i < sortArr.length; i++) {
			let key = sortArr[i].column;
			let order = sortArr[i].order;
			let fieldName = headers[key];

			let firstValue = first.cells[key].innerHTML;
			let secondValue = second.cells[key].innerHTML;

			// Определяем, является ли поле числовым
			let isNumericField = ['Возрастной рейтинг', 'Год', 'Оценка', 'Сборы(в долларах)'].includes(fieldName);

			// Для числовых полей преобразуем в числа
			if (isNumericField) {
				firstValue = parseFloat(firstValue) || 0;
				secondValue = parseFloat(secondValue) || 0;
			}

			if (firstValue > secondValue) return order ? -1 : 1;
			if (firstValue < secondValue) return order ? 1 : -1;
		}
		return 0;
	});



	// Преобразуем rowData в массив объектов
	let sortedData = rowData.map(row => {
		let obj = {};
		for (let i = 0; i < row.cells.length; i++) {
			let header = table.rows[0].cells[i].innerHTML; // Заголовок столбца
			obj[header] = row.cells[i].innerHTML; // Значение ячейки
		}
		return obj;
	});

	// Обновляем таблицу с помощью createTable
	createTable(sortedData, idTable);
}

let clearSort = (idTable, data, dataFormFilter, dataFormSort, toClearFilters = 1) => {
	if (toClearFilters)
		dataFormFilter.reset();
	dataFormSort.reset();
	setSortSelects(data[0], dataFormSort);
	clearTable(idTable);
	createTable(data, idTable);
}