function focus_input(id){
    if ($('#user-input-'+id).val() == ""){
        $("#input-area-"+id).removeClass("focus")
    } 
    else{
        $("#input-area-"+id).addClass("focus")
    }
}

function ChangeToMainA(){
    $("#main-box").fadeIn(200)
}
function ChangeToAccA(){
    $("#account-box").fadeIn(200)
}
function ChangeToSetA(){
    $("#setting-box").fadeIn(200)
    showClearSessionBtn(true)
}
function ChangeToMdlA(){
    $("#models-box").fadeIn(200)
}
function ChangeToWdgA(){
    $("#widgets-box").fadeIn(200)
}
function ChangeToRtsA(){
    $("#rights-box").fadeIn(200)
}

function ChangeToMain(){
    $("#login-box").fadeOut(1)
    $("#account-box").fadeOut(200)
    $("#models-box").fadeOut(200)
    $("#widgets-box").fadeOut(200)
    $("#setting-box").fadeOut(200)
    $("#rights-box").fadeOut(200)
    setTimeout(ChangeToMainA,250)
    $("#main").addClass("active")
    $("#acc").removeClass("active")
    $("#wig").removeClass("active")
    $("#mod").removeClass("active")
    $("#set").removeClass("active")
    $("#rts").removeClass("active")
}

function ChangeToAcc(){
    $("#login-box").fadeOut(1)
    $("#main-box").fadeOut(200)
    $("#models-box").fadeOut(200)
    $("#widgets-box").fadeOut(200)
    $("#setting-box").fadeOut(200)
    $("#rights-box").fadeOut(200)
    setTimeout(ChangeToAccA,250)
    $("#main").removeClass("active")
    $("#acc").addClass("active")
    $("#wig").removeClass("active")
    $("#mod").removeClass("active")
    $("#set").removeClass("active")
    $("#rts").removeClass("active")
}

function ChangeToSet(){
    $("#login-box").fadeOut(1)
    $("#main-box").fadeOut(200)
    $("#account-box").fadeOut(200)
    $("#models-box").fadeOut(200)
    $("#widgets-box").fadeOut(200)
    $("#rights-box").fadeOut(200)
    setTimeout(ChangeToSetA,250)
    $("#main").removeClass("active")
    $("#acc").removeClass("active")
    $("#wig").removeClass("active")
    $("#mod").removeClass("active")
    $("#set").addClass("active")
    $("#rts").removeClass("active")
}

function ChangeToMdl(){
    $("#login-box").fadeOut(1)
    $("#main-box").fadeOut(200)
    $("#account-box").fadeOut(200)
    $("#widgets-box").fadeOut(200)
    $("#setting-box").fadeOut(200)
    $("#rights-box").fadeOut(200)
    setTimeout(ChangeToMdlA,250)
    $("#main").removeClass("active")
    $("#acc").removeClass("active")
    $("#wig").removeClass("active")
    $("#mod").addClass("active")
    $("#set").removeClass("active")
    $("#rts").removeClass("active")
}

function ChangeToWdg(){
    $("#login-box").fadeOut(1)
    $("#main-box").fadeOut(200)
    $("#account-box").fadeOut(200)
    $("#models-box").fadeOut(200)
    $("#setting-box").fadeOut(200)
    $("#rights-box").fadeOut(200)
    setTimeout(ChangeToWdgA,250)
    $("#main").removeClass("active")
    $("#acc").removeClass("active")
    $("#wig").addClass("active")
    $("#mod").removeClass("active")
    $("#set").removeClass("active")
    $("#rts").removeClass("active")
}

function ChangeToRts(){
    $("#login-box").fadeOut(1)
    setTimeout(ChangeToRtsA,250)    
    $("#main").removeClass("active")
    $("#acc").removeClass("active")
    $("#wig").removeClass("active")
    $("#mod").removeClass("active")
    $("#set").removeClass("active")
    $("#rts").addClass("active")
}

function Loading(){
    $("#loading").fadeIn(100)
}
function Load() {
    $("#loading").fadeOut(100)
}

function show_widgets_edit(id) {
    $("#widgets_add").fadeOut(100)
    $("#widgets_edit").fadeIn(100)
    var name = $("#widgets_"+id).attr("widgets_name")
    var url = $("#widgets_"+id).attr("widgets_url")
    var ava = $("#widgets_"+id).attr("widgets_available")
    if (ava == "True"){
        $("#widgets_available_edit_Checkbox").attr("checked",true)
    }
    if (ava == "False"){
        $("#widgets_available_edit_Checkbox").prop("checked",false)
    }
    $("#widgets_preview").attr("src", url)
    $("#widgets_id_edit").val(id)
    $("#widgets_name_edit").val(name)
    $("#widgets_url_edit").val(url)
    $("#widgets_available_edit").val(ava)
}

function show_model_edit(id) {
    $("#model_add").fadeOut(100)
    $("#model_edit").fadeIn(100)
    var name = $("#model_"+id).attr("model_name")
    var url = $("#model_"+id).attr("model_url")
    // var ava = $("#model_"+id).attr("widgets_available")
    if (ava == "True"){
        $("#model_available_edit_Checkbox").attr("checked",true)
    }
    if (ava == "False"){
        $("#model_available_edit_Checkbox").prop("checked",false)
    }
    // $("#widgets_preview").attr("src", url)
    $("#model_id_edit").val(id)
    $("#model_name_edit").val(name)
    $("#model_url_edit").val(url)
    // $("#widgets_available_edit").val(ava)
}
function show_widgets_add() {
    $("#widgets_edit").fadeOut(100)
    $("#widgets_add").fadeIn(100)
    $("#widgets_name").val("")
    $("#widgets_url").val("")
}

function show_session_add() {
    $('#session_add').fadeIn(110)
}

//版本号
$(document).ready(function(){
    $("button").click(function(){
      $("#rights-box").fadeOut(100);
      $("#rts").removeClass("active")
    });
});

$(document).ready(function(){
    $("#widgets_close").click(function(){
        $("#widgets_edit").fadeOut(100);
    });
    $("#widgets_close_add").click(function(){
        $("#widgets_add").fadeOut(100);
      });
    $("#widgets_close_add_1").click(function(){
        $("#widgets_add").fadeOut(100);
    });
    $("#session_close").click(function(){
        $("#session_add").fadeOut(100);
    });
    $("#session_cancel").click(function(){
        $("#session_add").fadeOut(100);
    });
});

$(document).ready(function() {
//   拖动
var node = document.querySelector("#widgets_container")
	var draging = null
	node.ondragstart = function(event) {
		console.log("start:")
		// dataTransfer.setData把拖动对象的数据存入其中，可以用dataTransfer.getData来获取数据
		event.dataTransfer.setData("te", event.target.innerText)
		draging = event.target
	}
	node.ondragover = function(event) {
		console.log("over:")
		// 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，必须阻止对元素的默认处理方式
		event.preventDefault()
		var target = event.target
		if (target.nodeName === "LI" && target !== draging) {
			// 获取初始位置
			var targetRect = target.getBoundingClientRect()
			var dragingRect = draging.getBoundingClientRect()
			if (target) {
				// 判断是否动画元素
				if (target.animated) {
					return;
				}
			}
			if (_index(draging) < _index(target)) {
				// 目标比元素大，插到其后面
				// extSibling下一个兄弟元素
				target.parentNode.insertBefore(draging, target.nextSibling)
			} else {
				// 目标比元素小，插到其前面
				target.parentNode.insertBefore(draging, target)
			}
			_animate(dragingRect, draging)
			_animate(targetRect, target)
            load_active_widgets()
            upload_widgets_edit_order()
		}
	}
var node_tabs = document.querySelector("#tabs")
	var draging = null
	node_tabs.ondragstart = function(event) {
		console.log("start:")
		// dataTransfer.setData把拖动对象的数据存入其中，可以用dataTransfer.getData来获取数据
		event.dataTransfer.setData("te", event.target.innerText)
		draging = event.target
	}
	node_tabs.ondragover = function(event) {
		console.log("over:")
		// 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，必须阻止对元素的默认处理方式
		event.preventDefault()
		var target = event.target
		if (target.nodeName === "LI" && target !== draging) {
			// 获取初始位置
			var targetRect = target.getBoundingClientRect()
			var dragingRect = draging.getBoundingClientRect()
			if (target) {
				// 判断是否动画元素
				if (target.animated) {
					return;
				}
			}
			if (_index(draging) < _index(target)) {
				// 目标比元素大，插到其后面
				// extSibling下一个兄弟元素
				target.parentNode.insertBefore(draging, target.nextSibling)
			} else {
				// 目标比元素小，插到其前面
				target.parentNode.insertBefore(draging, target)
			}
			_animate(dragingRect, draging)
			_animate(targetRect, target)
            Refresh_Tabs()
            upload_session_edit_order()
		}
	}

})

//Single
function change_tab(id){
    var now = $(".current").val()
    $(".current").removeClass("current")
    $("#Tab"+id).addClass("current")
    $('#'+now).fadeOut(100)
    $('#'+id).fadeIn(110)
    smoothScroll("output-"+id);
}

function ReadFile(id){
    $.ajax({
        url: "/ReadFile",
        method: "POST",
        success: function(data){
            $("#"+id).val(data)
        }
    })
}

//ajax Interface
//edit
function upload_session_edit_order(){
    var ele = document.getElementById("tabs")
    var child = ele.firstElementChild
    var last = ele.lastElementChild
    for (i = 1;child.nextElementSibling != last;i++){
        var value = child.value
        $.ajax({
            url: "/EditSessionOrder",
            method: "POST",
            data: {
                id: value,
                order: i,
            },
            success: function(response){
                if (response.response){
                    Refresh_Tabs()
                }
            }
        })
        child = child.nextElementSibling
    }
}

function upload_widgets_edit_order(){
    var ele = document.getElementById("widgets_container")
    var child = ele.firstElementChild
    var last = ele.lastElementChild
    for (i =1;child.nextElementSibling != last ;i++){
        var value = child.id
        $.ajax({
            url: "/EditWidgetsOrder",
            method: "POST",
            data: {
                id: value,
                order: i,
            },
            success: function(response){
                if (response.response){
                    load_active_widgets()
                }
            }
        })
        child = child.nextElementSibling
    }
}

function upload_widgets_edit(){
    $.ajax({
        url: "/edit_widgets",
        method : "POST",
        data : {
            id: $("#widgets_id_edit").val(),
            operation: "edit",
            name: $("#widgets_name_edit").val(),
            url: $("#widgets_url_edit").val(),
            ava: $("#widgets_available_edit").val(),
        },
        success: function(response){
            if (response.response){
                alert(response.message,"success")
            }
            else{
                alert(response.message,"danger")
            }
            load_active_widgets()
            load_widgets()
            $("#widgets_edit").fadeOut(100);
        }
    })
}

function upload_widgets_del(){
    $.ajax({
        url: "/edit_widgets",
        method : "POST",
        data : {
            id: $("#widgets_id_edit").val(),
            operation: "del",
            name: $("#widgets_name_edit").val(),
            url: $("#widgets_url_edit").val(),
            ava: $("#widgets_avaliable_edit").val(),
        },
        success: function(response){
            if (response.response){
                alert(response.message,"success")
            }
            else{
                alert(response.message,"danger")
            }
            load_active_widgets()
            load_widgets()
            $("#widgets_edit").fadeOut(100);
        }
    })
}

function upload_widgets_add(){
    $.ajax({
        url: "/edit_widgets",
        method : "POST",
        data : {
            id: -1,
            name: $("#widgets_name_add").val(),
            url: $("#widgets_url_add").val(),
            ava: $("#widgets_available_add").val(),
        },
        success: function(response){
            if (response.response){
                alert(response.message,"success")
            }
            else{
                alert(response.message,"danger")
            }
            load_active_widgets()
            load_widgets()
            $("#widgets_add").fadeOut(100);
            $("#widgets_name_add").val("");
            $("#widgets_url_add").val("");
            $("#widgets_available_add").val("False");
            $("#widgets_available_add_Checkbox").prop("checked",false);
        }
    })
}

// 修复新建会话按钮事件绑定，确保每次弹窗都能生效
$(document).off('click', '#session_cmt').on('click', '#session_cmt', function() {
    Add_session();
});

function Add_session() {
    var comment = $("#session_comment").val();
    // 如果备注为空，自动用模型下拉框选中的文本
    if (comment === "") {
        comment = $("#session_model option:selected").text();
        $("#session_comment").val(comment); // 同步填入输入框
    }
    if (comment === ""){
        alert('内容不能为空',"warning");
        return;
    }
    $("#session_comment").val("");
    $.ajax({
        url: "/AddSession",
        method: "POST",
        data: {
            model_id: $("#session_model").val(),
            comment: comment,
        },
        success : function(response){
            if (response.response){
                alert(response.message,"success") ;
                // 新建成功后强制刷新标签和下拉框
                Refresh_Tabs(function(newSessionId){
                    change_tab(newSessionId);
                });
                $('#session_add').fadeOut(100);
            }
        }
    })
}

function Close_session(id) {
    $.ajax({
        url: "/CloseSession",
        method: "POST",
        data: {
            model_id: id,
        },
        success : function(response){
            // 删除成功后强制刷新标签和下拉框
            Refresh_Tabs();
        }
    })
}

//prompt
function GetPrompts(id){
    var text = $("#user-input-"+id).val();
    var source_id = $("#user-input-"+id).attr("source_id");
    $.ajax({
        url: '/prompts',
        type: 'POST',
        data: {
            text: text,
        },
        success: function(prompts) {
            $('#Prompt-'+source_id).empty()
            e = 0
            for (i in prompts){
                $('#Prompt-'+source_id).append("\
                <button id='prompt-single-"+ e +"' class='prompt' value='"+ prompts[i] + "' source_id= " + id +" onclick='prompts(`" + e + "`)' >"+ i +"</button>")
                e++
            }
        }
    })
}

function prompts(id){
    var value = $("#prompt-single-"+id).val()
    var source_id = $("#prompt-single-"+id).attr("source_id");
    $('#Prompt-'+source_id).empty()
    $('#user-input-'+source_id).val(""+value)
}

function commit_model(id,operate){
    if ($('#Url'+id).val() == "" || $('#Comment'+id).val() == ""){
        alert('内容不能为空',"warning");
        return;
    }
    $("#loading").fadeIn(100)
    $('#'+operate+id).attr("disabled",true)
    $.ajax({
        url: '/exchange',
        type: 'POST',
        data: {
            state: operate ,
            number: $('#id'+id).val() ,
            comment: $('#Comment'+id).val() ,
            type: $('#Type'+id).val() ,
            url: $('#Url'+id).val() ,
            APIkey: $('#APIkey'+id).val() ,
            LcCompiler: $('#LcCompiler'+id).val() ,
            LcUrl: $('#LcUrl'+id).val() ,
        },
        success: function(response) {
            if (response.response){
                alert(response.message,"success")
                Refresh_Tabs()
                $("#loading").fadeOut(100)
                $('#'+operate+id).removeAttr("disabled")
            }
            else{
                alert(response.message,"danger")
                $("#loading").fadeOut(100)
                $('#'+operate+id).removeAttr("disabled")
            }
            Refresh_ModelList()
        }
    });
}

function send_input_stream(id) {
    if ($('#user-input-' + id).val() == ""){
        alert('内容不能为空',"warning");
        return;
    }
    $("#input-area-"+id+" .image-preview-area").remove();
    $("#loading").fadeIn(100);
    UserInput = $('#user-input-' + id).val()
    $('#user-input-' + id).val("")
    $('#output-' + id).append('<div class="item item-right"><div class="bubble bubble-right">' + UserInput + '</div><div class="avatar"><i class="fa fa-user-circle"></i></div></div>');
    smoothScroll("output-"+id);
    let form = new FormData();
    form.append("userinput",UserInput)
    form.append("modelinput",$('#model-input-' + id).val())
    var use_search = $('#search-toggle-' + id).attr('data-checked') === 'true' ? 'true' : 'false';
    form.append("use_search", use_search);
    var use_detail = $('#detail-toggle-' + id).attr('data-checked') === 'true' ? 'true' : 'false';
    form.append("use_detail", use_detail);
    var fileInput = document.getElementById('image-upload-' + id);
    if (fileInput && fileInput.files.length > 0) {
        form.append('image', fileInput.files[0]);
    }
    fetch("/request_models_stream", {
        method: "POST",
        body: form,
    }).then(async (response) => {
        const reader = response.body.getReader();
        $("#loading").fadeOut(100)
        $('#output-' + id).append('<div class="item item-left"><div class="avatar">\
        <i class="fa fa-user-circle-o"></i></div>\
        <div class="bubble bubble-left" id="streaming"></div></div>');
        for await (const chunk of readChunks(reader)) {
            document.getElementById("streaming").innerHTML = new TextDecoder('utf-8').decode(chunk);
            smoothScroll("output-"+id);
        }
        hljs.highlightAll();
        $("#streaming").removeAttr("id");
    });
}
function readChunks(reader) {
    return {
        async *[Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

$(document).ready(function() {
//send request
$("#add").on('click',function() {
    if ($('#Url-1').val() == "" || $('#Comment-1').val() == ""){
        alert('内容不能为空',"warning");
        return;
    }
    $("#loading").fadeIn(100)
    $('#add').attr("disabled",true)
    $.ajax({
        url: '/exchange',
        type: 'POST',
        data: {
            state: 'add' ,
            number: $('#id').val() ,
            type: $('#Type-1').val() ,
            comment: $('#Comment-1').val() ,
            url: $('#Url-1').val() ,
            APIkey: $('#APIkey-1').val() ,
            LcCompiler: $('#LcCompiler-1').val() ,
            LcUrl: $('#LcUrl-1').val() ,
        },
        success: function(response) {
            if (response.response){
                alert("添加成功","success")
                $("#loading").fadeOut(100)
                $('#add').removeAttr("disabled")
            }
            else{
                alert("添加失败","danger")
                $("#loading").fadeOut(100)
                $('#add').removeAttr("disabled")
            }
            $('#Comment-1').val("")
            $('#Url-1').val("")
            $('#APIkey-1').val("")
            $('#LcCompiler-1').val("")
            $('#LcUrl-1').val("")
            Refresh_ModelList()
        }
    });
});
})

$(document).ready(function() {
    $("#change-adjust").on("click",function(){
        var now = $("body").attr("class")
        if (now == "light"){
            $("body").removeClass("light")
            $("body").addClass("dark")
        }
        if (now == "dark"){
            $("body").removeClass("dark")
            $("body").addClass("light")
        }
    })
})

// Refresh Data
function refresh_website(){
    Refresh_ModelList();
    Refresh_Tabs();
    load_active_widgets();
    load_widgets();
    load_settings();
    hljs.highlightAll();
}

function setup_website(){
    Refresh_ModelList();
    Refresh_Tabs();
    load_active_widgets();
    load_widgets();
    load_settings();
    Get_Version();
    hljs.highlightAll();
}

const smoothScroll = (id) => {
    const element = $(`#${id}`);
    element.stop().animate({
        scrollTop: element.prop("scrollHeight")
    }, 500);
}

function load_history(id) {
    $.ajax({
        url: "/GetHistory",
        method: "POST",
        data: {
            id: id,
        },
        success: function(data){
            $('#output-' + id).empty()
            for (i in data){
                $('#output-' + id).append('<div class="item item-right"><div class="bubble bubble-right" id="high_light_1">' + data[i].UserInput + '</div><div class="avatar"><i class="fa fa-user-circle"></i></div></div>');
                $('#output-' + id).append('<div class="item item-left"><div class="avatar"><i class="fa fa-user-circle-o"></i></div><div class="bubble bubble-left" id="high_light_2">' + data[i].response + '</div></div>');
                smoothScroll("output-"+id);
                hljs.highlightAll();
                }
        }
    })
}

// 视觉模型标记存储与读取
function getVisionModelIds() {
  try {
    return JSON.parse(localStorage.getItem('vision_model_ids') || '[]');
  } catch { return []; }
}
function setVisionModelIds(ids) {
  localStorage.setItem('vision_model_ids', JSON.stringify(ids));
}
function isVisionModel(id) {
  return getVisionModelIds().includes(id);
}
function toggleVisionModel(id) {
  let ids = getVisionModelIds();
  if (ids.includes(id)) {
    ids = ids.filter(x => x !== id);
  } else {
    ids.push(id);
  }
  setVisionModelIds(ids);
  Refresh_Tabs();
}

function Refresh_ModelList(){
    $.ajax({
        url: '/GetModelList',
        method: "POST",
        success: function(data){
            $('#ModelTable').empty()
            for (i in data){
                $('#ModelTable').append('<input type="hidden" id="id'+ data[i].id +'" value='+ data[i].id +'>')
                var visionChecked = isVisionModel(data[i].id) ? ' checked' : '';
                $('#ModelTable').append('\
                <tr id="ModelTr">\
                    <td>\
                    <select name="type" id="Type'+ data[i].id +'">\
                        <option>'+ data[i].type +'</option>\
                        <option>OpenAI</option>\
                        <option>WebUI</option>\
                        <option>API</option>\
                    </select>\
                    </td>\
                    <td> \
                        <input type="text" name="comment" id="Comment'+ data[i].id +'" placeholder="ChatGLM" value='+ data[i].name +'>\
                    </td>\
                    <td>\
                        <input type="text" class="url" id="Url'+ data[i].id +'" name="url" placeholder="127.0.0.1:8000" value='+ data[i].url +'>\
                    </td>\
                    <td>\
                        <input type="text" class="url" id="APIkey'+ data[i].id +'" name="APIkey" placeholder="Enter your API key here" value='+ data[i].api_key +'>\
                    </td>\
                    <td>\
                        <input type="text" class="url" id="LcCompiler'+ data[i].id +'" name="LcCompiler" placeholder=".\venv\python.exe & OpenAI" value='+ data[i].launch_compiler +'>\
                        <button class="edit" onclick="ReadFile(`LcCompiler' + data[i].id + '`)"><i class="fa fa-folder-open-o"></i></button>\
                    </td>\
                    <td>\
                        <input type="text" class="url" id="LcUrl'+ data[i].id +'" name="LCurl" placeholder="Browse File" value='+ data[i].launch_path +'>\
                        <button class="edit" onclick="ReadFile(`LcUrl' + data[i].id + '`)"><i class="fa fa-folder-open-o"></i></button>\
                        </td>\
                    <td>\
                        <button class="run" id="run-'+ data[i].id +'" value="'+ data[i].id +'" onclick="commit_model('+ data[i].id +',`run`)"><i class="fa fa-play"></i></button>\
                        <button class="stop" id="stop-'+ data[i].id +'" value="'+ data[i].id +'" onclick="commit_model('+ data[i].id +',`stop`)"><i class="fa fa-stop"></i></button>\
                    </td>\
                    <td>\
                        <button class="edit" id="edit-'+ data[i].id +'" value="'+ data[i].id +'" onclick="commit_model('+ data[i].id +',`edit`)"><i class="fa fa-edit"></i></button>\
                    </td>\
                    <td><button class="deny" id="del-'+ data[i].id +'" value="'+ data[i].id +'" onclick="commit_model('+ data[i].id +',`del`)"><i class="fa fa-trash"></i></button></td>\
                    <td><input type="checkbox" class="vision-model-checkbox" data-id="'+data[i].id+'"'+visionChecked+' /></td>\
                </tr>')
            }
        }
    })
}

// 支持图像的模型名关键词白名单
const IMAGE_MODEL_WHITELIST = [
  'llava', 'llava-phi', 'llama3-vision', 'llama-vision', 'gemma3-vision', 'gemma3-vl', 'qwen-vl', 'mistral-small-vision'
];
function supportsImage(modelName, modelId) {
  if (isVisionModel(modelId)) return true;
  modelName = (modelName || '').toLowerCase();
  return IMAGE_MODEL_WHITELIST.some(key => modelName.includes(key));
}

function Refresh_Tabs(callback){ 
    $.ajax({
        url: "/GetActiveModels",
        method: "POST",
        success(data){
            $("#tabs").empty()
            $("#Contents").empty()
            var count = 1
            var lastSessionId = null;
            for (i in data){
                lastSessionId = data[i].id;
                if (count == 1){
                $("#tabs").append('<li draggable="true" class="li current" id="Tab'+ data[i].id +'" value='+ data[i].id +' onclick="change_tab('+ data[i].id +')">\
                <span>'+ data[i].comment +'</span>\
                <i class="fa fa-close close" onclick="Close_session('+ data[i].id +')"></i>\
                </li>')
                if (data[i].model_type == "OpenAI" || data[i].model_type == "API" || data[i].model_type == "Json"){
                    var modelName = (data[i].model_name || data[i].name || "");
                    var supportImage = supportsImage(modelName, data[i].id);
                    var imageBtnClass = supportImage ? "image-upload-btn" : "image-upload-btn image-upload-btn-disabled";
                    var imageInputDisabled = supportImage ? "" : "disabled";
                    var imageBtnTitle = supportImage ? "" : " title='该模型不支持图像' ";
                    $("#Contents").append('\
                    <div class="dialogbox_container" id='+ data[i].id +'>\
                        <div class="content" id="output-'+ data[i].id +'"></div>\
                        <div class="prompt_container" id="Prompt-'+ data[i].id +'"></div>\
                        <div class="input-area input-area-custom" id="input-area-'+ data[i].id +'">\
                            <button type="button" class="search-toggle" id="search-toggle-'+data[i].id+'" data-checked="false">\
                                <i class="fa fa-globe"></i> 联网搜索\
                            </button>\
                            <button type="button" class="detail-toggle" id="detail-toggle-'+data[i].id+'" data-checked="false">\
                                <i class="fa fa-list-ol"></i> 详细解题\
                            </button>\
                            <label class="'+imageBtnClass+'" for="image-upload-'+data[i].id+'" style="margin-left:6px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#f5f6f7;box-shadow:0 2px 8px #0001;cursor:pointer;"'+imageBtnTitle+'>\
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49"/></svg>\
                                <input type="file" class="image-upload" id="image-upload-'+data[i].id+'" accept="image/*" style="display:none;" '+imageInputDisabled+' />\
                            </label>\
                            <div class="txtb txtb-custom">\
                                <textarea class="userInputArea" placeholder="输入内容" id="user-input-'+ data[i].id +'" source_id="'+ data[i].id +'" onInput="GetPrompts('+ data[i].id +');focus_input('+ data[i].id +')"\
                                 onclick=""></textarea>\
                            </div>\
                            <input id="model-input-'+ data[i].id +'" type="hidden" value='+ data[i].id +' />\
                            <button type="submit" class="SendInput send-btn-custom" id="SendInput" value="'+ data[i].id +'" onclick="send_input_stream(`'+ data[i].id +'`)"><i class="fa fa-send"></i></button>\
                        </div>\
                    </div>')
                }
                if (data[i].model_type == "WebUI"){
                    $("#Contents").append('\
                    <div id='+ data[i].id +'">\
                        <iframe allow="autoplay *; encrypted-media *;" src="'+ data[i].model_url +'"></iframe>\
                    </div>')
                }
                count = 0
                }
                else{
                    $("#tabs").append('<li draggable="true" class="li" id="Tab'+ data[i].id +'" value='+ data[i].id +' onclick="change_tab('+ data[i].id +')">\
                    <span>'+ data[i].comment +'</span>\
                    <i class="fa fa-close close" onclick="Close_session('+ data[i].id +')"></i>\
                    </li>')
                    if (data[i].model_type == "OpenAI" || data[i].model_type == "API" || data[i].model_type == "Json"){
                        var modelName = (data[i].model_name || data[i].name || "");
                        var supportImage = supportsImage(modelName, data[i].id);
                        var imageBtnClass = supportImage ? "image-upload-btn" : "image-upload-btn image-upload-btn-disabled";
                        var imageInputDisabled = supportImage ? "" : "disabled";
                        var imageBtnTitle = supportImage ? "" : " title='该模型不支持图像' ";
                        $("#Contents").append('\
                        <div class="dialogbox_container" id='+ data[i].id +' style="display: none;">\
                            <div class="content" id="output-'+ data[i].id +'\"></div>\
                            <div class="prompt_container" id="Prompt-'+ data[i].id +'\"></div>\
                            <div class="input-area input-area-custom" id="input-area-'+ data[i].id +'">\
                                <button type="button" class="search-toggle" id="search-toggle-'+data[i].id+'" data-checked="false">\
                                    <i class="fa fa-globe"></i> 联网搜索\
                                </button>\
                                <button type="button" class="detail-toggle" id="detail-toggle-'+data[i].id+'" data-checked="false">\
                                    <i class="fa fa-list-ol"></i> 详细解题\
                                </button>\
                                <label class="'+imageBtnClass+'" for="image-upload-'+data[i].id+'" style="margin-left:6px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#f5f6f7;box-shadow:0 2px 8px #0001;cursor:pointer;"'+imageBtnTitle+'>\
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49"/></svg>\
                                    <input type="file" class="image-upload" id="image-upload-'+data[i].id+'" accept="image/*" style="display:none;" '+imageInputDisabled+' />\
                                </label>\
                                <div class="txtb txtb-custom">\
                                    <textarea class="userInputArea" placeholder="输入内容" id="user-input-'+ data[i].id +'" source_id="'+ data[i].id +'" onInput="GetPrompts('+ data[i].id +');focus_input('+ data[i].id +')"\
                                     onclick=""></textarea>\
                                </div>\
                                <input id="model-input-'+ data[i].id +'" type="hidden" value='+ data[i].id +' />\
                                <button type="submit" class="SendInput send-btn-custom" id="SendInput" value="'+ data[i].id +'" onclick="send_input_stream(`'+ data[i].id +'`)"><i class="fa fa-send"></i></button>\
                            </div>\
                        </div>')
                    }
                    if (data[i].model_type == "WebUI"){
                        $("#Contents").append('\
                        <div id='+ data[i].id +' style="display: none;" class="iframe_container">\
                            <iframe allow="autoplay *; encrypted-media *;" src="'+ data[i].model_url +'"></iframe>\
                        </div>')
                    }
                }
                load_history(data[i].id)
            }
            $("#session_model").empty()
            $.ajax({
                url: "/GetModelForSession",
                method: "POST",
                success: function(data){
                    var count = 1
                    for (i in data.ModelList) {
                        if (count == 1){
                            $("#session_model").append("<option selected value="+ data.ModelDict[i] +">"+ data.ModelList[i]+"</option>")
                            count = 0
                        }
                        else{
                            $("#session_model").append("<option value="+ data.ModelDict[i] +">"+ data.ModelList[i]+"</option>")
                        }
                    }
                }
            })
            $("#tabs").append('<li class="li" id="TabAdd" value="Add" onclick="show_session_add()">\
            <i class="fa fa-plus close"></i>\
            </li>')
            load_active_widgets()
            if (callback && lastSessionId) callback(lastSessionId);
        }
    })
}

function load_active_widgets(){
    $.ajax({
        url: "/GetActiveWidgets",
        method: "POST",
        success: function(data){
            $("#widgets_container_live").empty()
            for (i in data){
                $("#widgets_container_live").append('\
                <div class="widgets_contentbox medium">\
                    <iframe src='+ data[i].widgets_url +' frameborder=0></iframe>\
                </div>\
                ')
            }
        }
    })
}

function load_widgets(){
    $.ajax({
        url: "/GetWidgets",
        method: "POST",
        success: function(data){
            $("#widgets_container").empty()
            for (i in data){
                $("#widgets_container").append('\
                <li class="ele" draggable="true" id="'+ data[i].id +'">\
                    <div style="width: 70%;float:left;">\
                        <span><div class="widgets_title">'+ data[i].widgets_name +'</div></span>\
                        <span><div class="widgets_subtitle">'+ data[i].widgets_url +'</div></span>\
                    </div>\
                    <i class="fa fa-bars"></i>\
                    <i class="fa fa-info" id="widgets_'+ data[i].id +'" widgets_name="'+ data[i].widgets_name +'"\
                    widgets_url="'+ data[i].widgets_url +'" widgets_available="' + data[i].available + '" onclick="show_widgets_edit('+ data[i].id +')"></i>\
                </li>\
                ')
            }
        }
    })
}

function switch_load(id){
    var now_value = $("#"+id).val()
    if (now_value == "True" || now_value == "true"){
        $("#"+id).val("False")
    }
    if (now_value == "False" || now_value == "false"){
        $("#"+id).val("True")
    }
}

function save_settings(){
    $.ajax({
        url: "/EditSetting",
        method : "POST",
        data: {
            Theme : $("body").attr("class"),
            Language : $("#Language").val(),
            ActiveExamine : $("#ActiveExamine").val(),
            Timeout : $("#Timeout").val(),
            Host : $("#Host").val(),
            Port : $("#Port").val(),
            Develop : $("#Develop").val(),
        },
    success: function(data){
        if (data.response == true){
            alert("保存成功","success")
            alert("部分更改将在重启程序后生效","warning")
            load_settings()
        }
    }
    })
}

function load_settings(){
    $.ajax({
        url: "/GetSetting",
        method : "POST",
    success: function(data){
        if (data.response == "true"){
            var now = $("body").attr("class")
            if (now == data.Theme){}
            else{
                $("body").removeClass(now)
                $("body").addClass(data.Theme)
            }
            $("#"+data.Language).attr("selected",true)
            $("#ActiveExamine").val(data.ActiveExamine)
            if (data.ActiveExamine == "True"){
                $("#ActiveExamine_Checkbox").attr("checked",true)
            }
            else{
                $("#ActiveExamine_Checkbox").removeAttr("checked")
            }
            if (data.Develop == "True"){
                $("#Develop_Checkbox").attr("checked",true)
            }
            else{
                $("#Develop_Checkbox").removeAttr("checked")
            }
            $("#Language").empty()
            for (j in data.Languages){
                if (data.Languages[j] == data.Language){
                    $("#Language").append("\
                    <option id="+ data.Languages[j] +" selected>"+ data.Languages[j] +"</option>\
                    ")
                }
                else {
                    $("#Language").append("\
                    <option id="+ data.Languages[j] +">"+ data.Languages[j] +"</option>\
                    ")
                }
            }
            $("#ActiveExamine").val(data.ActiveExamine)
            $("#Develop").val(data.Develop)
            $("#Timeout").val(data.Timeout)
            $("#Host").val(data.Host)
            $("#Port").val(data.Port)
            $("Develop").val(data.Develop)
            showClearSessionBtn(true);
        }
    }
    })
}

function Get_Version(){
    $.ajax({
        url: "/GetVersion",
        method: "POST",
        success : function(data){
            $("#Version").empty();
            $("#Version").text(data.version);
            $("#IconBarVersion").empty();
            $("#IconBarVersion").text("Version "+data.version);
        }
    })
}

//CommitModel
function loading(){
    $("#loading").fadeIn(100)
    setTimeout(function(){ $("#loading").fadeOut(100) },1000)
}

// 获取元素在父元素中的index
function _index(el) {
    var index = 0
    if (!el || !el.parentNode) {
        return -1
    }
    // previousElementSibling：上一个兄弟元素
    while (el && (el = el.previousElementSibling)) {
        index++
    }
    return index
}
// 触发动画
function _animate(prevRect, target) {
    var ms = 300
    if (ms) {
        var currentRect = target.getBoundingClientRect()
        if (prevRect.nodeType === 1) {
            prevRect = prevRect.getBoundingClientRect()
        }
        _css(target, 'transition', 'none')
        _css(target, 'transform', 'translate3d(' +
            (prevRect.left - currentRect.left) + 'px,' +
            (prevRect.top - currentRect.top) + 'px,0)'
        );

        target.offsetWidth; // 触发重绘

        _css(target, 'transition', 'all ' + ms + 'ms');
        _css(target, 'transform', 'translate3d(0,0,0)');
        // 事件到了之后把transition和transform清空
        clearTimeout(target.animated);
        target.animated = setTimeout(function() {
            _css(target, 'transition', '');
            _css(target, 'transform', '');
            target.animated = false;
        }, ms);
    }
}

// 给元素添加style
function _css(el, prop, val) {
    var style = el && el.style
    if (style) {
        if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                val = document.defaultView.getComputedStyle(el, '')
            } else if (el.currentStyle) {
                val = el.currentStyle
            }
            return prop === void 0 ? val : val[prop]
        } else {
            if (!(prop in style)) {
                prop = '-webkit-' + prop;
            }
            style[prop] = val + (typeof val === 'string' ? '' : 'px')
        }
    }
}

$(document).off('click', '#session_cmt').on('click', '#session_cmt', function() {
    Add_session();
});

// 按钮切换逻辑
$(document).off('click', '.search-toggle').on('click', '.search-toggle', function() {
    var checked = $(this).attr('data-checked') === 'true';
    if (checked) {
        $(this).attr('data-checked', 'false');
        $(this).removeClass('selected');
    } else {
        $(this).attr('data-checked', 'true');
        $(this).addClass('selected');
    }
});
$(document).off('click', '.detail-toggle').on('click', '.detail-toggle', function() {
    var checked = $(this).attr('data-checked') === 'true';
    if (checked) {
        $(this).attr('data-checked', 'false');
        $(this).removeClass('selected');
    } else {
        $(this).attr('data-checked', 'true');
        $(this).addClass('selected');
    }
});

// 只在设置页面显示清空按钮，右下角"更改"按钮左侧
function showClearSessionBtn(force) {
    if (force) $('.clear-session-btn').remove();
    var $saveBtn = $('#setting-box .save');
    if ($('.clear-session-btn').length === 0 && $('#setting-box').is(':visible') && $saveBtn.length > 0) {
        // 直接插入为同级button，class为save和clear-session-btn，去除绝对定位，利用CSS原生布局
        var $btn = $('<button type="button" class="save clear-session-btn" style="background:rgba(255,89,89,0.85);border: 1px solid rgba(5,31,0,0.671);color:#fff;margin-right:18px;"><i class="fa fa-trash"></i>清空会话</button>');
        $saveBtn.before($btn);
        $btn.off('click').on('click', function() {
            if(confirm('确定要清空所有会话和历史吗？此操作不可恢复！')){
                $.post('/ClearAllSessionsHistory', function(res){
                    if(res.response){
                        alert(res.message, 'success');
                        location.reload();
                    }else{
                        alert('清空失败', 'danger');
                    }
                });
            }
        });
    }
}
function hideClearSessionBtn() {
    $('.clear-session-btn').remove();
}
// 监听页面切换，只有设置页面显示按钮
$(document).ready(function() {
    // 初始判断
    if($('#setting-box').is(':visible')) showClearSessionBtn(true);
    // 监听页面切换
    $(document).on('click', '#set', function(){
        setTimeout(function(){ showClearSessionBtn(true); }, 200);
    });
    $(document).on('click', '#main,#acc,#wig,#mod,#rts', function(){
        hideClearSessionBtn();
    });
});

$(document).on('click', '#import-ollama-btn', function() {
    $(this).attr('disabled', true).text('导入中...');
    $.post('/import_ollama_models', function(res){
        alert(res.message, res.response ? 'success' : 'danger');
        Refresh_ModelList();
        $('#import-ollama-btn').attr('disabled', false).html('<i class="fa fa-download"></i> 一键导入Ollama模型');
    });
});

function notifyWidgetsFullscreen() {
  var isFullscreen = !!document.fullscreenElement || window.innerWidth >= 900;
  // 通知所有widgets_container_live下的iframe
  document.querySelectorAll('#widgets_container_live iframe').forEach(function(iframe){
    try {
      iframe.contentWindow.postMessage({type: 'fullscreen', value: isFullscreen}, '*');
    } catch(e) {}
  });
}
document.addEventListener('fullscreenchange', function() {
  notifyWidgetsFullscreen();
  setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 100);
});
window.addEventListener('message', function(e){
  if(e.data && e.data.type === 'get_fullscreen'){
    notifyWidgetsFullscreen();
  }
});

// 绑定checkbox事件
$(document).off('change', '.vision-model-checkbox').on('change', '.vision-model-checkbox', function(){
  var id = $(this).data('id');
  toggleVisionModel(id);
  if ($(this).is(':checked')) {
    alert('视觉模型已启用，可上传图片', 'success');
  } else {
    alert('视觉模型已关闭，图片上传已禁用', 'secondary');
  }
});

// 监听图片上传，显示缩略图和移除按钮
$(document).off('change', '.image-upload').on('change', '.image-upload', function(){
  var fileInput = this;
  var id = $(this).attr('id').replace('image-upload-', '');
  var $inputArea = $('#input-area-' + id);
  $inputArea.find('.image-preview-area').remove();
  if (fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var html = '<div class="image-preview-area" style="display:flex;align-items:center;margin:0 8px 0 0;">'+
        '<img src="'+e.target.result+'" alt="图片预览" style="max-width:48px;max-height:48px;border-radius:6px;border:1px solid #eee;margin-right:8px;">'+
        '<span style="color:#2196f3;font-size:13px;margin-right:8px;">图片已选中</span>'+
        '<button type="button" class="remove-image-btn" style="background:none;border:none;color:#888;cursor:pointer;font-size:18px;">&times;</button>'+
        '</div>';
      $inputArea.prepend(html);
    }
    reader.readAsDataURL(fileInput.files[0]);
  }
});
// 删除图片和预览
$(document).off('click', '.remove-image-btn').on('click', '.remove-image-btn', function(){
  var $area = $(this).closest('.input-area');
  $area.find('.image-upload').val('');
  $area.find('.image-preview-area').remove();
});