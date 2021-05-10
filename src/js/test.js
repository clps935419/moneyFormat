$(document).ready(function () {
  $('.test1').set_money_format({
    is_positive: false,
    is_thousand_format: true,
    decimal_num: 2,
  });
  $('.test2').set_money_format({
    is_positive: true,
    is_thousand_format:false,
    decimal_num: 4,
  });
  $('.test3').set_money_format({
    is_positive: false,
    is_thousand_format: true,
    decimal_num: 0,
  });
});
