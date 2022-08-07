"use strict"

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('form');
    const name = document.getElementById('name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const yearSelect = document.getElementById('year');
    const statusSentMessage = document.querySelector('.form__message');
    const rightFormBlock = document.querySelector('.form__right-block');
    const errorMessage = {
        text: 'Form cannot be blank',
        data: 'Form not submitted...'
    }

    const months = ['January', 'February', 'March',
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'];

    form.addEventListener('submit', formSubmit);

    function formSubmit(e) {
        e.preventDefault();

        let error = formValidate(form);

        if (error === 0) {
            formSent();
            openSentMessage();
            addSnakeAnimation();
        } else {
            // alert('Form entered incorrectly...');
            modal(errorMessage.text);
        }
    }

    // Sent Form
    function formSent() {

        const formData = new FormData(form);
        const object = {};
        formData.forEach(function (value, key) {
            object[key] = value;
        });

        fetch('server.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(object)
        })
            .then(data => data.text())
            .then(data => {
                console.log(data);
            })
            .then(() => form.reset())
            .catch(() => {
                // alert('Form not submitted...');
                modal(errorMessage.data)
            });
    }

    //  Validate Form

    function formValidate(form) {
        let error = 0;
        const nameValue = name.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        if (nameValue === '') {
            setErrorFor(name, 'Name cannot be blank');
            error++;
        } else {
            setSuccessFor(name)
        }

        if (lastNameValue === '') {
            setErrorFor(lastName, 'Name cannot be blank');
            error++;
        } else {
            setSuccessFor(lastName)
        }

        if (emailValue === '') {
            setErrorFor(email, 'Email cannot be blank');
            error++;
        } else if (!emailTest(emailValue)) {
            setErrorFor(email, 'Email is not valid');
            error++;
        } else {
            setSuccessFor(email)
        }

        if (passwordValue === '') {
            setErrorFor(password, 'Password cannot be blank');
            error++;
        } else if (!passwordTest(passwordValue)) {
            setErrorFor(password, 'Password is not valid');
            error++;
        } else {
            setSuccessFor(password)
        }

        if (confirmPasswordValue === '') {
            setErrorFor(confirmPassword, 'Password cannot be blank');
            error++;
        } else if (passwordValue !== confirmPasswordValue) {
            setErrorFor(confirmPassword, 'Passwords does not match');
            error++;
        } else {
            setSuccessFor(confirmPassword)
        }

        return error;
    }

    function modal(errorMessage) {
        const thanks = document.createElement('div');

        thanks.classList.add('form__message-error')
        thanks.innerHTML = `
            <div class="form__title">${errorMessage}</div>
        `
        document.querySelector('.form__inner').append(thanks);

        setTimeout(() => {
            thanks.classList.add('hide');
        }, 3000);
    }

    function addSnakeAnimation() {
        const btn = document.querySelector('.form__btn');

        btn.classList.add('form__btn-animation');
    }

    function setErrorFor(input, message) {
        const formItem = input.parentElement;
        const small = formItem.querySelector('small');
        small.innerText = message;
        formItem.className = 'form__item error';
    }

    function setSuccessFor(input) {
        const formItem = input.parentElement;
        formItem.className = 'form__item';
    }

    function emailTest(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(email);
    }

    function passwordTest(password) {
        return /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)
    }

    function openSentMessage() {

        rightFormBlock.classList.add('hide');
        rightFormBlock.classList.remove('show');

        statusSentMessage.classList.toggle('show');

        setTimeout(() => {
            statusSentMessage.classList.add('hide');
            statusSentMessage.classList.remove('show');

            rightFormBlock.classList.add('show');
            rightFormBlock.classList.remove('hide');
        }, 3000);
    }

    // Select Date of Birth

    (function addMouth() {
        months.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item;
            monthSelect.appendChild(option);
        });

        monthSelect.value = 'January';
    })();

    let previousDay;

    function populateDays(month) {
        while (daySelect.firstChild) {
            daySelect.removeChild(daySelect.firstChild)
        }
        let dayNum;

        let year = yearSelect.value;

        if (month === 'January' || month === 'March' ||
            month === 'May' || month === 'July' || month === 'October' ||
            month === 'October' || month === 'December') {

            dayNum = 31;

        } else if (month === 'April' || month === 'June' ||
            month === 'September' || month === 'November') {

            dayNum = 30;
        } else {
            if (new Date(year, 1, 29).getMonth() === 1) {
                dayNum = 29;
            } else {
                dayNum = 28
            }
        }

        for (let i = 1; i <= dayNum; i++) {
            const option = document.createElement('option');
            option.textContent = i;
            daySelect.appendChild(option);
        }

        if (previousDay) {
            daySelect.value = previousDay;
            if (daySelect.value === '') {
                daySelect.value = previousDay - 1;
            }
            if (daySelect.value === '') {
                daySelect.value = previousDay - 2;
            }
            if (daySelect.value === '') {
                daySelect.value = previousDay - 3;
            }
        }
    }

    function populateYears() {
        let year = new Date().getFullYear();

        for (let i = 0; i < 101; i++) {
            const option = document.createElement('option');
            option.textContent = year - i;
            yearSelect.appendChild(option);

        }
    }

    populateDays(monthSelect.value);
    populateYears();

    yearSelect.onchange = function () {
        populateDays(monthSelect.value);
    }

    monthSelect.onchange = function () {
        populateDays(monthSelect.value);
    }

    daySelect.onchange = function () {
        previousDay = daySelect.value;
    }

});