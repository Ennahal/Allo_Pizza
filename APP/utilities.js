export function formatMoney(value, isoCode = 'fr-FR')
{
  	return new Intl.NumberFormat(isoCode, { style: 'currency', currency: 'EUR' }).format(value);
}