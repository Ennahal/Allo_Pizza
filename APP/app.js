let orderForm =
    {
        rows:
            {
                matt: 0,
                molly: 0,
                elyse: 0,
                elyse4: 0,
            },

        ht: 0,
        tva: 0,
        ttc: 0
    };

let prices =
    {
        'matt': 10.50,
        'molly': 15.50,
        'elyse': 20.50,
        'elyse4': 25.50,
    };

function onClickChangeQuantity() {
    const id = `quantity-${this.dataset.pizza}`;
    const input = document.getElementById(id);

    if (this.dataset.action == 'plus' && input.value < 8) {
        input.value++;

    } else if (this.dataset.action == 'minus' && input.value > 0) {
        input.value--;
    }

    orderForm.rows[this.dataset.pizza] = input.value;

    updateOrderForm();
}

function formatMoney(value, isoCode = 'fr-FR')
{
  	return new Intl.NumberFormat(isoCode, { style: 'currency', currency: 'EUR' }).format(value);
}


function updateOrderForm() {

    // boucle qui permet de calculerle montan total du bon de commande 
    orderForm.ht =  0;

    for (const [pizza, quantity] of Object.entries(orderForm.rows)) {
        //console.log(`${pizza} = ${quantity}`);
        orderForm.ht += parseFloat(quantity * prices[pizza]);
    }

    orderForm.tva = orderForm.ht * 0.2 ;
    orderForm.ttc = orderForm.tva + orderForm.ht;

    //mise a jour de l'afichage des montant
    document.getElementById('ht').textContent = formatMoney(orderForm.ht)
    document.getElementById('tva').textContent = formatMoney(orderForm.tva);
    document.getElementById('ttc').textContent = formatMoney(orderForm.ttc);

    //mise a jour tBody
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/NumberFormat
    document.getElementById('product-rows').textContent = null;

    let table = document.getElementById('template');
    let tBody = document.getElementById('product-rows');

    for (const [pizza, quantity] of Object.entries(orderForm.rows)) {
        if (quantity > 0) {
            //creation d'un clone de notre template 
            let clone = document.importNode(table.content, true);
            let td = clone.querySelectorAll("td");

            //modifictation du clonne 
            td[0].textContent = pizza;
            td[1].textContent = formatMoney(prices[pizza]);
            td[2].textContent = quantity;
            td[3].textContent = formatMoney(quantity * prices[pizza]);
          
            //injection denotre clone dans le tbody 
            tBody.appendChild(clone);
        }
    }
}

// code principal
document.addEventListener("DOMContentLoaded", function () {
    //rechercher tout les bouton 
    let buttons = document.querySelectorAll(".counter");

    for (let button of buttons) {
        button.addEventListener('click', onClickChangeQuantity)
    }
});