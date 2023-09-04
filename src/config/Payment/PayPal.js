var paypal = require('paypal-rest-sdk');
module.exports =paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXx4YJuep_SRDKihNey_HamKNgrkpBbWZSJehtXFkjii__MTPxBtayuBwNUsyNzPrXJ0kvnpZ2QobjIt',
    'client_secret': 'ECYypfS5goHBg2UFCERwSuWddvvtZQwUFz9JN6TrEDQbaCHyHF5ydg6TVkshlhQlrkBV6M7CE5c02gaK'
  });