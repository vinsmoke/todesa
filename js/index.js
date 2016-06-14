$(function  () {
    var todos=localStorage.todos?$.parseJSON(localStorage.todos):[];
    var selected=localStorage.selected?$.parseJSON(localStorage.selected):'All';
    var render=function  () {
        $('#todo-list').empty().append(function  () {
            var ts;
            $('#filters li a:contains('+selected+')').addClass('selected')
            if(selected==='All'){
                ts=todos;
            }else if(selected==='Active'){
                ts=$.grep(todos,function  (v) {
                    return v.isDown===false;
                })
            }else{
                ts=$.grep(todos,function  (v) {
                    return v.isDown===true;
                })
            }
            return $.map(ts,function  (v) {
                var check=v.isDown?'checked':'';
                var addc=v.isDown?'completed':'';
                return '<li data-id="'+v.id+'" class="'+addc+'"><div class="view"><input type="checkbox" '+check+' class="toggle"><label >'+v.content+'</label><buttom class="destroy"></buttom></div><input  class="edit" value="'+v.content+'"></li>';
            })
        })
        //全选和单选同步
        var selectAll=$.grep(todos,function  (v) {
               return v.isDown;
        })
        if(selectAll.length===todos.length){
            $('#toggle-all').prop('checked',true);
        }else{
            $('#toggle-all').prop('checked',false);
        }
        //计数
        $('#todo-count strong').html(todos.length-selectAll.length);
        //多选删除
        if(selectAll.length){
            $('#clear-completed').css('display','block');
        }else{
             $('#clear-completed').css('display','none');
        }
    }   
    render();
    var addTodos=function  (e) {
        if(e.keyCode!==13||$.trim($(this).val())===''){
                return;
            }
            var newtodos={
            id:todos.length?Math.max.apply(null,$.map(todos,function  (v) {
                return v.id;
            }))+1:1001,
            content:$(this).val(),
            isDown:false
            }
            todos.push(newtodos)
            $(this).val('');
            localStorage.todos=JSON.stringify(todos)
            render();
    }
    $('#new-todo').on('keyup',addTodos)
    
    var removeTodos=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        todos=$.grep(todos,function  (v) {
            return v.id!==id;
        })
        localStorage.todos=JSON.stringify(todos);
        render();
    }
    $('#todo-list').on('click','.destroy',removeTodos)
    var toggle=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        var zd=this.checked;     
        $(todos).each(function  (i,v) {
            if(v.id===id){
                v.isDown=zd;
            }
        })
        localStorage.todos=JSON.stringify(todos);
        render();
    }
    $('#todo-list').on('click','.toggle',toggle)

    var editing=function  () {
        $(this).closest('li').addClass('editing');
        $('.edit').focus();
    }
    $('#todo-list').on('dblclick','label',editing)
    
    var save=function  () {
        var id=parseInt($(this).closest('li').attr('data-id'));
        var _v=$(this).val();
        $(todos).each(function  (i,v) {
            if(id===v.id){
                v.content=_v;
            }
        })
        localStorage.todos=JSON.stringify(todos);
        render();
    }
    $('#todo-list').on('keyup','.edit',function  (e) {
        if(e.keyCode===13){
            $.proxy(save,$(this))();
        }
    })
    $('#todo-list').on('focusout','.edit',save)
     
    var selecteds=function  () {
         $('#filters .selected').removeClass('selected');
         $(this).addClass('selected');
         selected=$(this).html();
         localStorage.selected=JSON.stringify(selected)
         render();
    }
    $('#filters li a').on('click',selecteds)
    var toggleAll=function  () {
         var check=this.checked;
         $(todos).each(function  (i,v) {
             v.isDown=check;
         })
         localStorage.todos=JSON.stringify(todos);
         render();
    }
    $('#toggle-all').on('click',toggleAll)
    var deletes=function  () {
        $('#todo-list .completed').each(function  (i,v) {
            removeTodos();
        })
    }
    $('#clear-completed').on('click',deletes)

})