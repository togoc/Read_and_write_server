var callback
var lastPosition = []
var lastFile
function changeHash(str) {
    window.history.replaceState(null, null, 'home');
    // window.history.pushState(null, null, 'home');
    fix(callback.files);
    // var arr = str.split('\\');
    // location.hash = 'd:\\' + arr[1]
    location.hash = str
    $('.location h4').html(decodeURIComponent(location.hash));
    lastPosition.push(callback.index);
}

/**
 * @param {string} url 请求地址和内容 , 
 * 如果是读取目录 : "/read?code=" + 目录地址 ; 
 * 如果是返回目录 : "/read?prev=" + 目录地址 ; 
 * 如果是主目录 : "/homepage" .
 * 
 */
function ajax(url) {
    $.ajax({ url }).done(function (res) {
        callback = res
        changeHash(callback.index)
    })
}

function prev() {
    console.log(callback)
    if (callback.index.indexOf('/'))
        lastFile = callback.index.slice(callback.index.lastIndexOf('/'))

    if (callback.index == callback.home)
        lastFile = 0

    if (callback.index != callback.home && callback.index.indexOf('/') == -1)
        lastFile = (callback.index.split('\\'))[1]


    // $.ajax({ url: '/read?prev=' + lastFile }).done(function (res) {
    //     callback = res
    //     changeHash(callback.index)
    // })
    ajax('/read?prev=' + callback.index)
}



function fix(arr) {
    var t = ''
    function addFiles(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf('.') == -1) {
                t += `
                <div class="doc">
                    <img src="../static/images/file.png" alt="">
                    <a href="#${arr[i]}">${arr[i]}</a>
                </div>
                `
            }
        }
    }

    function addMp4(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf('.') != -1 && (arr[i].split('.').pop() == 'mp4' || arr[i].split('.').pop() == 'avi')) {
                t += `
                <div class="doc">
                    <img src="../static/images/video.png" alt="">
                    <a href="#${arr[i]}">${arr[i]}</a>
                    <a href="${(callback.index).slice(callback.index.indexOf('\\'))}\\${arr[i]}" download="${arr[i]}">点击下载</a>
                </div>
                `
            }
        }
    }
    /**
     * 输入一个目录数组,页面添加内容
     * @param {array} arr 关于当前文件夹下文件目录的数组
     */
    function addUnknowFile(arr) {
        let dir = null
        if (callback.home == callback.index) {
            dir = ""
        } else {
            dir = callback.index.split(callback.home)[1]
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf('.') != -1 && arr[i].split('.').pop() != 'mp4' && arr[i].split('.').pop() != 'avi') {
                t += `
                <div class="doc">
                    <img src="../static/images/unknow.png" alt="">
                    <a href="#${arr[i]}">${arr[i]}</a>
                    <a href="${dir}/${arr[i]}" download="${arr[i]}">点击下载</a>
                    </div>
                
                `
            }
        }
    }

    addFiles(arr);
    addMp4(arr);
    addUnknowFile(arr);
    $('.doc_list').html(t)
    getData()
}



function getData() {
    $('.doc a:first-of-type').click(function (e) {
        var oevent = e || event
        if (oevent.preventDefault) {
            oevent.preventDefault()
        } else {
            oevent.returnValue = false
        }

        if ($(this).html().indexOf('.') == -1) {
            var url = '/read?code=' + callback.index + "/" + $(this).html();
            // $.ajax({ url: '/read?code=/' + url }).done(function (res) {
            //     callback = res
            //     changeHash(callback.index)
            // })
            ajax(url)
        } else {
            $('.player').toggleClass('show');
            $('.blur').toggleClass('show1');
            document.querySelector('#video').src = (callback.index.split('Read_and_write_server')).pop() + '/' + $(this).html()
        }
    })
    $('.player_close').click(function () {
        $('.player').removeClass('show')
        $('.blur').removeClass('show1')
        var video = document.querySelector('#video')
        video.removeAttribute("src")
        video.pause();
    })

}

function addPost() {
    $('.post_index').html(callback.index)
    $('.blur').toggleClass('show1');
    $('.postfile').toggleClass('show1');
    $('.close_post').click(function () {
        ajax("/read?code=" + callback.index);
        $('.postfile').removeClass('show1');
        $('.blur').removeClass('show1');
    })
}

var this_file = document.querySelector('.this_file')
function postFile() {
    var url
    var this_file = document.querySelector('.this_file')
    if (this_file.checked) {
        url = 'formdata?index=' + callback.index
    } else {
        url = 'formdata'
    }
    $.ajax({
        method: 'post',
        url: url,
        data: new FormData(document.querySelector('.formdata')),
        processData: false,
        contentType: false,
        cache: false
    }).done(function (res) {
        if (res.msg) {
            alert('上传成功!')
        } else {
            alert('上传错误,请查看控制台详细内容');
            console.log(res)
        }
    })
}


window.addEventListener('popstate', function () {
    if (location.hash == '') {
        location.reload()
        // // prev()   
        // // lastPosition.pop()
        // $.ajax({ url: '/read?back=' + lastPosition[lastPosition.length - 1] }).done(function (res) {
        //     callback = res
        //     changeHash(callback.index)
        // })
        // console.log(lastPosition)
    }
})

/**
 * @param {string} index 当前目录地址
 * @param {string} dirName 文件夹名
 */
function mkdir(index, dirName) {
    ajax("/mkdir?index=" + index + "&dirName=" + dirName)
}
var flat = true

window.onload = function () {
    ajax("/homepage");
    $('#last_dir').click(function () {
        prev()
    });
    $('#post_file').click(function () {
        if ($(this).val() == "上传文件")
            addPost()
    });
    $('#mkdir').click(function () {
        ($(this).val() == "确认") ? ($(this).val("新建文件夹")) : ($(this).val("确认"));
        $(this).toggleClass("button_style");
        // ($("#post_file").val() == "上传文件") ? ($("#post_file").val("取消")) : ($("#post_file").val("上传文件"));
        // $("#post_file").toggleClass("button_style");

        t = $(`
        <div class="doc">
            <img src="static/images/file.png" alt="">
            <input id="new_dir" type="text" style="height:100%;font-size:100%"  autofocus="autofocus">
        </div>
        
        `)
        /**
         * 输入一个关于文件夹目录地址的数组,返回一个 {index , arr1} 对象 , 
         * index : 有几个文件夹目录  
         * arr1 : 当前目录下关于所有文件夹名字的数组
         * @param {array} arr 文件夹目录数组
         */
        function LastIndexOfDir(arr) {
            let index = 0
            let arr1 = []
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('.') == -1) {
                    index++
                    arr1.push(arr[i])
                }
            }
            return { index, arr1 }
        }

        if ($(this).val() == "新建文件夹") {
            if ($("#new_dir").val().trim() != "" && $("#new_dir").val().indexOf(".") == -1 && !LastIndexOfDir(callback.files).arr1.some((i) => i == $("#new_dir").val())) {
                mkdir(callback.index, $("#new_dir").val().trim())
            } else {
                alert("输入有误(文件夹名不可包含'.'或已存在或空)");
                ajax("/read?code=" + callback.index);
            }
        } else {
            $(`.doc_list .doc:nth-of-type(${LastIndexOfDir(callback.files).index})`).after(t)
        }
    });
    $('#home').click(function () {
        location.reload()

    });

    $('.sentfile').click(function () {
        postFile()
    });

    getData();

}





