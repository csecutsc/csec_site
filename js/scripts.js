$(document).ready(function () {
    $('#logo').fadeIn(2000);
    $('#title').fadeIn(6000);
    $('.toggle-nav').click(function (e) {
        $('#menuitems').slideToggle(400);
        //$('#main').toggleClass("blur .disable");
        $(this).toggleClass('active');
        $('.menu ul').toggleClass('active');
        e.preventDefault();
    });
    // smooth scrolling
    $("a[href^='#']").on('click', function(e) {
        var hash = this.hash;
       $('html, body').animate({
           scrollTop: $(hash).offset().top
         }, 1000, function(){
           window.location.hash = hash;
         });
        e.preventDefault();
    });
    
    
});

$(function () {
    $(document).scroll(function () {
    var $nav = $(".fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});

