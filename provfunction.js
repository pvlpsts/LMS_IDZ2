let f = (...arrays) => {

	let arr = arrays.flat();

	let arrInAll = arr.filter(key => arrays.every(array => array.includes(key)));

	let answer = arrInAll.filter((key, index) => ((key >= -99 && key <= -10) || (key >= 10 && key <= 99))
		&& arrInAll.indexOf(key) === index);

	return answer;
}

//console.log(f([-17, 12, -13, 8], [12, -17, 15, 6, 8], [12, 15, -17, 8], [-17, 17, 17, 12]));