import { formatMoney } from './utilities.js';
import { productDatabase } from './data.js';

class OrderForm {
    constructor() {
        this.tbody = document.getElementById('product-rows');
        this.template = document.getElementById('product-template');

        this.quantities = {};
        this.ht = 0;
        this.ttc = 0;
        this.tva = 0;

        // Initialisation des quantités commandées de pizzas.
        for (const productKey of Object.keys(productDatabase)) {
            this.quantities[productKey] = 0;
        }

        this.stripe = Stripe('pk_test_7E2D1nO0PKcng5omQPFFzuYj');
        // Create an instance of Elements.
        this.stripeElements = this.stripe.elements();
    }

    onClickValidateOrder() {
        const orderFunel = document.getElementById('order-funel');
        orderFunel.classList.add('visible');

        let db = firebase.firestore();

        db.collection("order").add({
            timestamp: new Date, 	// objet Date() représentant la date et l'heure de la commande
            quantities: this.quantities,	// les quantités commandées de pizzas
            ht: this.ht,			// le montant HT de la commande
            ttc: this.ttc,		// le montant TTC de la commande
            tva: this.tva		// le montant TVA de la commande

        })

        let card = this.stripeElements.create('card');

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');
    }

    attach(elements) {
        for (const element of elements) {
            element.addEventListener('click', this.onClickChangeQuantity.bind(this));
        }
        const buttonOrder = document.getElementById('order')

        buttonOrder.addEventListener('click', this.onClickValidateOrder.bind(this))
    }

    onClickChangeQuantity(event) {
        const id = `quantity-${event.currentTarget.dataset.pizza}`;
        const input = document.getElementById(id);

        if (event.currentTarget.dataset.action == 'plus' && input.value < 8) {
            input.value++;
        }
        else if (event.currentTarget.dataset.action == 'minus' && input.value > 0) {
            input.value--;
        }

        this.quantities[event.currentTarget.dataset.pizza] = input.value;

        this.update();
    }

    update() {
        this.ht = 0;

        for (const [productKey, quantity] of Object.entries(this.quantities)) {
            this.ht += parseFloat(productDatabase[productKey].price * quantity);
        }

        this.tva = this.ht * 0.20;
        this.ttc = this.ht + this.tva;


        document.getElementById('ht').textContent = formatMoney(this.ht);
        document.getElementById('tva').textContent = formatMoney(this.tva);
        document.getElementById('ttc').textContent = formatMoney(this.ttc);


        this.tbody.innerHTML = null;

        for (const [productKey, quantity] of Object.entries(this.quantities)) {
            if (quantity > 0) {
                let clone = document.importNode(this.template.content, true);
                let columns = clone.querySelectorAll('td');

                columns[0].textContent = productDatabase[productKey].title;
                columns[1].textContent = formatMoney(productDatabase[productKey].price);
                columns[2].textContent = quantity;
                columns[3].textContent = formatMoney(productDatabase[productKey].price * quantity);

                this.tbody.appendChild(clone);
            }
        }

        const order = document.getElementById('order');
        order.removeAttribute('disabled');
    }
}
export default OrderForm;