let abc = '12345'
const testEs6Js = (arg) =>{
    console.log(arg)  
  }
testEs6Js(abc)
$(function(){
    $('.read-more').on('click',function () {
        if ($('#readAll').html() === '阅读全文') {
            $('.read-body').removeClass('maxStyle')
            $('#readAll').html('收起')
        } else {
            $('.read-body').addClass('maxStyle')
            $('#readAll').html('阅读全文')
        }
    })
});