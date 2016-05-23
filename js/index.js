$(function() {
  // $('a[href*=#]:not([href=#])').click(function() {
  //   if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
  //
  //     var target = $(this.hash);
  //     target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
  //     if (target.length) {
  //       $('html,body').animate({
  //         scrollTop: target.offset().top
  //       }, 1000);
  //       return false;
  //     }
  //   }
  // });

  $("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });
  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  var $project_list = $('#project-list');
  var projects;

  //印出project列表
  var renderProjects = function() {
    $project_list.empty();
    for(var key in projects){
      var project_this = projects[key];
      $project_list.append(
        '<li class="list-group-item">'+
          '<a id="myLink" href="#" onclick="toDiaryPage(`'+project_this.pid+'`);">'+
            '<img src="img/' + project_this.picture+'">'+
            '<span>'+ project_this.title + ' (' + project_this.startDate +' ~ ' + project_this.endDate + ')</span>'+
          '</a>'+
          '<div class="btn-group config-button">'+
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
              '<span class="glyphicon glyphicon-cog" aria-hidden="true" style="color: gray;"></span>'+
            '</button>'+
            '<ul class="dropdown-menu">'+
              '<li><a class="edit-button" data-key="'+key+'">編輯旅遊集</a></li>'+
              '<li><a class="delete-button" data-key="'+key+'">刪除旅遊集</a></li>'+
            '</ul>'+
          '</div>'+
        '</li>'
      );
    }
  };

  //排序project
  $('#sort-button').click(function(){
    projects.reverse();
    renderProjects();
  });

  var loadProjectsData = function(){
    $.ajax({
      url: '/api/sos987987/projects',
      type: 'get',
      dataType: 'json',
      success: function(data){

        console.log(data);
        projects = data;
        console.log(projects);
        renderProjects();
      }
    });
  };

  //首次自動ajax載入project data
  loadProjectsData();
  //新增project
  var $add_project_modal = $('#add-project-modal');
  $('#submit-create-button').click(function(){
    console.log("123", 123);
    $.ajax({
      url: '/api/sos987987/projects',
      type: 'post',
      data: {
        title: $add_project_modal.find('input[name="title"]').val(),
        startDate: $add_project_modal.find('input[name="startDate"]').val(),
        endDate: $add_project_modal.find('input[name="endDate"]').val(),
        picture: $add_project_modal.find('input[name="picture"]').val()
      },
      success: function(data) {
        console.log("ok");
        loadProjectsData();
        $add_project_modal.modal('hide');
        $add_project_modal.find('input[type="text"]').val('');
      }
    });
  });


  //編輯project
  var $edit_project_modal = $('#edit-project-modal');
  $project_list.on('click','.edit-button',function(){
    var project_this = projects[$(this).data('key')];
    $edit_project_modal.find('input[name="title"]').val(project_this.title);
    $edit_project_modal.find('input[name="startDate"]').val(project_this.startDate);
    $edit_project_modal.find('input[name="endDate"]').val(project_this.endDate);
    $edit_project_modal.find('input[name="picture"]').val(project_this.picture);
    $edit_project_modal.find('input[name="pid"]').val(project_this.pid);
    $edit_project_modal.modal('show');
  });

  $('#submit-edit-button').click(function(){
    console.log("123", 123);
    $.ajax({
      url: '/api/sos987987/projects/'+$edit_project_modal.find('input[name="pid"]').val(),
      type: 'put',
      data: {
        title: $edit_project_modal.find('input[name="title"]').val(),
        startDate: $edit_project_modal.find('input[name="startDate"]').val(),
        endDate: $edit_project_modal.find('input[name="endDate"]').val(),
        picture: $edit_project_modal.find('input[name="picture"]').val()
      },
      success: function(data) {
        console.log("ok");
        loadProjectsData();
        $edit_project_modal.modal('hide');
      }
    });
  });

  //刪除project
  $project_list.on('click','.delete-button',function(){
    var project_this = projects[$(this).data('key')];
    $.ajax({
      url: '/api/sos987987/projects/'+project_this.pid,
      type: 'delete',
      success: function(data) {
        console.log("ok");
        loadProjectsData();
      }
    });
  });
});

//==================function================
function toDiaryPage(projectID){
    //console.log(projectID);

    $.ajax({
      url:'/toDiaryPage',
      type:'post',
      dataType:'text',
      data:{pid:projectID},
      success:function(result){
        alert(result);
        window.location.href = '/diarys';
        //console.log("success");
      },error:function(err){
        alert("err");
      }

    });
    //window.location.href = '/diary';
}
