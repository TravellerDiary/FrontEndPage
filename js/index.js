<!-- Custom Theme JavaScript -->
// Closes the sidebar menu
// Scrolls to the selected menu item on the page
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  $("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });
  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  $.ajax({
    url:'/api/sos987987/projects', 
    type:'get',
    dataType:'json',
    success: function(data){
      for(var key in data.projects){
        console.log(data.projects[key]);
        $('#project-list').append('<li class="list-group-item"><a href="cabinetin.html"><img src="img/'+data.projects[key].picture+'" width="50" height="50"><span>'+data.projects[key].title+'</span></a><div class="btn-group config-button"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-cog"></span></button><ul class="dropdown-menu"><li><a href="#">編輯旅遊集</a></li><li role="separator" class="divider"></li></ul></div></li>');
      }
    }
  });
});
