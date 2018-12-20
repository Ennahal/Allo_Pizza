import OrderForm from './OrderForm.js'
import config  from './config.js';

document.addEventListener('DOMContentLoaded', function()
{
	let buttons   = document.querySelectorAll('.counter');
	let orderForm = new OrderForm();

    orderForm.attach(buttons);
    
    firebase.initializeApp(config);
});

