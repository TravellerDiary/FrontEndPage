$(function() {
//尚未把 userid 和 projectid抓出來給 每一個顯示的日記

  $("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });
  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  //var $project_list = $('#project-list');
  var $diary_list = $('#diary-list');

  //var projects;
  var diarys;
  var current_projectID;

  //印出project列表
  //var renderProjects = function() {
  var renderDiarys = function() {
    $diary_list.empty();
    for(var key in diarys){
      //var project_this = diarys[key];
      var diary_this = diarys[key];
      var diary_pic = diary_this.picture;
  
      $diary_list.append(
        '<li class="list-group-item">'+
          '<a id="myLink" href="#" onclick="toDiaryContentPage(5729a1b0d6b0d4dc14b8e459);">'+  //陳暐海陸哥專案遊的假資料
            '<img src="'+diary_pic+'" height="50px" width="50px">'+
            '<span>'+ diary_this.title + ' (' + diary_this.date + ')</span>'+
          '</a>'+
          '<div class="btn-group config-button">'+
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
              '<span class="glyphicon glyphicon-cog" aria-hidden="true" style="color: gray;"></span>'+
            '</button>'+
            '<ul class="dropdown-menu">'+
              '<li><a class="edit-button" data-key="'+key+'">編輯日記</a></li>'+
              '<li><a class="delete-button" data-key="'+key+'">刪除日記</a></li>'+
            '</ul>'+
          '</div>'+
        '</li>'
      );
    }
  };

  //排序project
  $('#sort-button').click(function(){
    diarys.reverse();
    renderDiarys();
  });

  //var loadProjectsData = function(){
  var loadDiarysData = function(){
    //取得project id
    var url = '/api/sos987987/'+ current_projectID + '/diarys';
     $.ajax({
       url: url,
       type: 'get',
       dataType: 'json',
       success: function(data){
         diarys = data;
         renderDiarys();
       }
     });
  };

  var loadProjectID = function(){
      $.ajax({
         url:'/getProjectID',
         type:'post',
         dataType:'text',
         success: function(projectID){
             //alert("tfdkjksfdlj");
             current_projectID = projectID;
             loadDiarysData();
             loadProjectName(projectID);
        }
     });
  };

  var loadProjectName = function(projectID){
    var url = '/api/sos987987/projects/'+projectID;

    $.ajax({
       url: url,
       type:'get',
       dataType:'json',
       success: function(data){
          $("#ProjectName").append(data[0].title);
      }
   });
  }

loadProjectID();  //頁面載入時只要作一次該函式就好

  //新增diary
  //var $add_project_modal = $('#add-project-modal');
  var $add_diary_modal = $('#add-diary-modal');

  var dfieldPhoto = $('#fieldPhoto');
  dfieldPhoto.fileupload({
      dataType: 'json',
      error: function (xhr) {
          console.log(xhr);
      },
      success: function (response) {
          console.log(response);
      }
      //列出上傳的檔案
      // done: function(e, data){
      //     $.each(data.result.files, function(index, file){
      //         // $('.formContainer').html($('<div class="upload">File uploaded: ' + file.name + '</div>'));
      //         alert(file.name);
      //     })
      // }
  });

//==============新增日記照片上傳=======================
  var diaryPic ;
  var dfieldPhoto = $('#fieldPhoto');
  dfieldPhoto.fileupload({
      dataType: 'json',
      error: function(xhr) {
          console.log(xhr);
      },
      success: function(response) {
          console.log(response + "success");
      },
      done: function(e, data){
          $.each(data.result.files, function(index, file){
            //  alert(file.name);
             diaryPic = file.name;
          })
      }
  });

  $('#submit-create-button').click(function(){

    var url = '/api/sos987987/'+ current_projectID +'/diarys';
    $.ajax({
      url: url,
      type: 'post',
      data: {
        title: $add_diary_modal.find('input[name="title"]').val(),
        date: $add_diary_modal.find('input[name="date"]').val(),
        picture: "uploads/sos987987/" + diaryPic   //這邊先暫時用sos987987的帳號
      },    //這邊的picture路靜要注意一下  diary.html再views資料夾裡
      success: function(data) {
        console.log("ok");
        loadDiarysData();
        $add_diary_modal.modal('hide');
        $add_diary_modal.find('input[type="text"]').val('');
      }
    });
  });


  //===========編輯project===========================
  var $edit_diary_modal = $('#edit_diary_modal');
  $diary_list.on('click','.edit-button',function(){
    var diary_this = diarys[$(this).data('key')];
    $edit_diary_modal.find('input[name="title"]').val(diary_this.title);
    $edit_diary_modal.find('input[name="date"]').val(diary_this.date);
    $edit_diary_modal.find('input[name="picture"]').val(diary_this.picture);
    $edit_diary_modal.find('input[name="did"]').val(diary_this.did);  // _id 為日記ID 須做更改!
    $edit_diary_modal.modal('show');
  });

  $('#submit-edit-button').click(function(){
    var url = '/api/sos987987/'+ current_projectID +'/diarys/'+$edit_diary_modal.find('input[name="did"]').val();
    $.ajax({
      url: url,
      type: 'put',
      data: {
        title: $edit_diary_modal.find('input[name="title"]').val(),
        date: $edit_diary_modal.find('input[name="date"]').val(),
        picture: $edit_diary_modal.find('input[name="picture"]').val()
      },
      success: function(data) {
        console.log("ok");
        loadDiarysData();
        $edit_diary_modal.modal('hide');
      }
    });
  });

  //刪除project
  $diary_list.on('click','.delete-button',function(){
    var diary_this = diarys[$(this).data('key')];
    var url = '/api/sos987987/'+ current_projectID +'/diarys/'+diary_this.did;
    $.ajax({
      url: url,  //注意 這裡要修改成 did
      type: 'delete',
      success: function(data) {
        console.log("ok");
        loadDiarysData();
      }
    });
  });
});

//==================function================
function toDiaryContentPage(diaryID){
    alert("toDiaryContentPage");
    //console.log(projectID);
    //
    // $.ajax({
    //   url:'/toDiaryPage',
    //   type:'post',
    //   dataType:'text',
    //   data:{pid:projectID},
    //   success:function(result){
    //     window.location.href = '/diarys';
    //     //console.log("success");
    //   },error:function(err){
    //     alert("err");
    //   }
    //
    // });
    //window.location.href = '/diary';
}

function toProjectPage(){
    window.location.href = '/';
}
