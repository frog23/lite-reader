	$(document).ready(function () {
     $('body').layout({
       north:{
        resizable:false,
        closable:false,
        size:"auto",
        spacing_open:0
       },
       center:{
         size:250,
         spacing_closed:0,
       }
   });
     $('body > .ui-layout-center').layout({
        south:{
          size:250,
        }
     });
     $(document).click(hideAddFeed);
     $('#addfeed > *').click(showAddFeed);

     var currentFeed=null;
     $('#feeds li').live("click",function(){
       getItems($(this).attr('id'));
       if(currentFeed)
         currentFeed.removeClass('selected');
       $(this).addClass('selected');
       currentFeed=$(this);
      });

     var currentItem=null;
     

     
   });
   function initItemsBehavior(){
     currentItem=null;
      $('#items li').click(function(){
          getDesc($(this).attr('id'));
          if(currentItem)
            currentItem.removeClass('selected');
          $(this).addClass('selected');
          currentItem=$(this);
          });
   }
   function getDesc(id){
    $.getJSON('?index/getdesc/'+id,function(data){
      if(data.desc==null){
        $("#south").html($('<a href="'+data.link+'"/>').html(data.title));
      }else{
        $("#south").html(data.desc);
      }
      var item=$("#items li[id='"+id+"']");
      if(item.hasClass("new")){
        var count=$("#feeds li.selected span");
        count.text(parseInt(count.text())-1);
        item.removeClass("new");
      }
    });
   }

   function getItems(id){
    $.getJSON('?index/getitems/'+id,function(data){
       $("#items").html("");
       $.each(data, function(i,item){
          var li=$('<li/>').attr("id",item.id).html(item.title);
          if(item.is_new=="1"){
           li.addClass("new"); 
          }
          li.appendTo("#items");
      })
       initItemsBehavior();
    })
   }
   function urlencode(s) {
     s = encodeURIComponent(s);
     return s.replace(/~/g,'%7E').replace(/%20/g,'+');
   }
    function addFeed(url){
      var aInput=$("#urlToAdd");
      var af=$('#addfeed .add');
      var currImg=af.css('background-image');
      af.css('background-image','url(public/images/loading.gif)');
      $.getJSON('?index/add/'+urlencode(url),function(data){
          var container=$(".ui-layout-west ul");
          $.each(data, function(i,feed){
            var li=$('<li/>').attr("id",feed.id).addClass("new").html(feed.title);
            li.append("(<span>"+feed.unread+"</span>)");
            li.appendTo(container);
            });
          $("#feeds li.new").animate({backgroundColor:"white"},2000)
          af.css('background-image',currImg);
          aInput.val("");
          hideAddFeed();
          })
    }
     
   function showAddFeed(e){
     e.stopPropagation();
     var aButton=$("#addfeed a");
     var aInput=$("#urlToAdd");
     aInput.removeClass('ui-state-error');
     aButton.parent().animate({width:"230px"},500,null,function(e){
            aInput.show();
            aButton.unbind('click');
            aButton.click(function(e){
              e.stopPropagation();
              var bValid = true;
				  aInput.removeClass('ui-state-error');
              bValid = bValid && checkLength(aInput,"password",10,255);
              bValid = bValid && checkRegexp(aInput,/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,"Please Enter a Valid Url.");
              if(bValid){
                addFeed(aInput.val());
                aInput.val("");
                hideAddFeed();
              }
              
            });
     });
   }
   function hideAddFeed(){
     var aButton=$("#addfeed a");
     var aInput=$("#urlToAdd");
     aInput.hide();
     aButton.parent().animate({width:"60px"},300,null,function(){
       aButton.unbind('click');
       $('#addfeed > *').click(showAddFeed);
     });
   }
   function checkLength(o,n,min,max) {
     if ( o.val().length > max || o.val().length < min ) {
       o.addClass('ui-state-error');
       alert("Length of " + n + " must be between "+min+" and "+max+".");
       return false;
     } else {
       return true;
     }
   }

   function checkRegexp(o,regexp,n) {
     if ( !( regexp.test( o.val() ) ) ) {
       o.addClass('ui-state-error');
       alert(n);
       return false;
     } else {
       return true;
     }
   }



