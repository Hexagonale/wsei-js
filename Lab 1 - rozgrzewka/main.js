const input1 = document.querySelector('#input1');
input1.addEventListener('input', () => {
	submit();
});

const input2 = document.querySelector('#input2');
input2.addEventListener('input', () => {
	submit();
});

const input3 = document.querySelector('#input3');
input3.addEventListener('input', () => {
	submit();
});

const input4 = document.querySelector('#input4');
input4.addEventListener('input', () => {
	submit();
});

const submit = () => {
	const value1Raw = input1.value.trim();
	if (value1Raw === '') {
		return;
	}

	const value1 = parseFloat(value1Raw);
	if (isNaN(value1)) {
		alert('Wartość 1 nie jest liczbą');
		return;
	}

	const value2Raw = input2.value.trim();
	if (value2Raw === '') {
		return;
	}

	const value2 = parseFloat(value2Raw);
	if (isNaN(value2)) {
		alert('Wartość 2 nie jest liczbą');
		return;
	}

	const value3Raw = input3.value.trim();
	if (value3Raw === '') {
		return;
	}

	const value3 = parseFloat(value3Raw);
	if (isNaN(value3)) {
		alert('Wartość 3 nie jest liczbą');
		return;
	}

	const value4Raw = input4.value.trim();
	if (value4Raw === '') {
		return;
	}

	const value4 = parseFloat(input4.value);
	if (isNaN(value4)) {
		alert('Wartość 4 nie jest liczbą');
		return;
	}

	const sum = value1 + value2 + value3 + value4;
	const min = Math.min(value1, value2, value3, value4);
	const max = Math.max(value1, value2, value3, value4);
	const avg = sum / 4;

	const result = document.querySelector('#result');
	result.innerHTML =
		`Suma: ${sum}` + '<br>' + `Minimum: ${min}` + '<br>' + `Maximum: ${max}` + '<br>' + `Średnia: ${avg}`;
};

const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
	e.preventDefault();

	submit();
});

const button = document.querySelector('#button');
button.addEventListener('click', (e) => {
	e.preventDefault();

	submit();
});
