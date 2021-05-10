;(function($, window, document,undefined) {
    $.fn.set_money_format = function (
      options
    ) {
      var ele = this;
      var params = $.extend(
        {
          is_positive: true,
          is_thousand_format: true,
          decimal_num: 2,
        },
        options
      );
      var new_money_format = new money_format(params);
      ele.each(function (index, element) {
          $(this).off('keyup');
          $(this).off('blur');
        $(this).on({
          keyup: function () {
            //複製貼上的話也會跑這段
            var tmp_val = $(this).val();
            var tmp_ele = $(this);
            new_money_format.get_rule(tmp_ele, tmp_val);
          },
          blur: function () {
            var tmp_val = $(this).val();
            var tmp_ele = $(this);
            new_money_format.get_rule(tmp_ele, tmp_val, true);
          },
        });
      });
    };
})(jQuery, window, document);


function money_format(params) {
  this.params = params;
  this.is_positive = params.is_positive; //是否為正數
  this.is_thousand_format = params.is_thousand_format; //是否加入千分位格式
  this.decimal_num = params.decimal_num; //取到小數點第幾位
  this.save_val; //儲存數字
  this.right_side_num; //小數點右邊
}
//ele帶入的元素、val為元素的值、是否是blur事件
money_format.prototype.get_rule = function (ele, val, blur) {
  var format = this;
  var is_positive = format.is_positive;
  var is_thousand_format = format.is_thousand_format;
  var decimal_num = format.decimal_num;
  var is_blur = blur;
  //確認是否包含負數
  var check_is_positive = format.check_is_positive(val);
  //先把數字存進去
  format.save_num_event(val);
  //判斷有小數點先左右切割
  var is_decimal = format.is_decimal();
  //防止數字前面為0
  format.prevent_first_num_is_zero();
  //格式化符號
  format.positive_format();
  //是否加入千分位格式
  if (is_thousand_format) {
    format.thousand_format();
  }
  //blur事件要補0捕到限制幾位數
  if (is_blur) {
    format.blur_decimal_format();
  }
  //取道小數第幾位
  if (decimal_num !== 0 && is_decimal) {
    format.decimal_format();
  }
  //如果可以容納負數，負數的補"-"處理
  if (!is_positive && check_is_positive) {
    format.negative_format();
  }
  //blur事件判斷如果輸入框只有輸入"-"要刪除
  if (is_blur) {
    format.blur_basic_format();
  }
  //把數字讀出來顯示
  format.load_num_event(ele);
};
//防止第一個數字為0
money_format.prototype.prevent_first_num_is_zero = function () {
  var format = this;
  var tmp_val = format.save_val;
  if (tmp_val.length !== 0) {
    tmp_val = parseInt(tmp_val.replace(/\D/g, '')).toString();
    format.save_val = tmp_val;
  }
};
//正數千分位
money_format.prototype.thousand_format = function () {
  var format = this;
  var tmp_val = format.save_val;

  // format number 1000000 to 1,234,567
  tmp_val = tmp_val.replace(/\D/g, '');
  var after_str = tmp_val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  format.save_val = after_str;
};
//正數純數字
money_format.prototype.positive_format = function () {
  // format number 1000000 to 1,234,567
  var format = this;
  var tmp_val = format.save_val;
  var right_side = format.right_side;
  if (right_side !== undefined) {
    right_side = right_side.replace(/\D/g, '');
    format.right_side = right_side;
  }
  var after_str = tmp_val.replace(/\D/g, ''); //排除數字以外的東西
  format.save_val = after_str;
};
//確認是否為小數點
money_format.prototype.is_decimal = function () {
  var format = this;
  var tmp_val = format.save_val;
  var decimal_pos = tmp_val.indexOf('.');
  var right_side;
  if (decimal_pos !== -1) {
    right_side = tmp_val.substring(decimal_pos);
    format.save_val = tmp_val.substring(0, decimal_pos);
    format.right_side = right_side;
    return true;
  } else {
    return false;
  }
};
//小數點格式
money_format.prototype.decimal_format = function () {
  var format = this;
  var tmp_val = format.save_val; //左邊
  var decimal_num = format.decimal_num;
  var right_side = format.right_side; //小數點右邊
  if (decimal_num !== 0 && tmp_val !== '') {
    right_side = right_side.substring(0, decimal_num);
    var total = tmp_val + '.' + right_side;
    format.save_val = total;
  }
};

//確認是否包含負數
money_format.prototype.check_is_positive = function (val) {
  if (val.indexOf('-') !== -1) {
    return true;
  } else {
    return false;
  }
};
//如果有負數加入"-"
money_format.prototype.negative_format = function () {
  var format = this;
  var tmp_val = format.save_val;
  var tmp_val = '-' + tmp_val;
  format.save_val = tmp_val;
};
//把數字存進去
money_format.prototype.save_num_event = function (val) {
  var format = this;
  format.save_val = val;
};
//把數字顯示出來
money_format.prototype.load_num_event = function (ele) {
  var format = this;
  ele.val(format.save_val);
};
/////////////blur事件///////////////////
//小數點格式、取到第幾位就補幾個0
money_format.prototype.blur_decimal_format = function () {
  var format = this;
  var decimal_num = format.decimal_num;
  for (var i = 0; i < decimal_num; i++) {
    format.right_side += '0';
  }
};
//blur 基本格式化 如果他只輸入一個字且為符號就刪除
money_format.prototype.blur_basic_format = function () {
  var format = this;
  var tmp_val = format.save_val;
  //判斷輸入的符號後面是不是數字
  var regex = new RegExp(/^(\-|\.)?\d/);
  if (tmp_val.length == 1) {
    //長度>1在判斷，因為允許輸入一個符號ex:"-"、"."
    if (!regex.test(tmp_val)) {
      format.save_val = '';
    }
  }
};

