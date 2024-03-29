# Read-and-write-server
------
## Nodejs + express 简单上传/下载服务器文件 [实例地址](http://182.254.195.126:8181)
> 1.0
* 仅支持在线播放视频,视频必须放在**server.js**文件下一级目录
* 基本框架内容已经完成了,查看图片,播放音乐这些实现日后看情况加入.
* 上传文件选择 **当前目录** 时将保存再当前浏览的界面,否则将保存至 *server.js* 同级目录下的 *dist*.
* ~~上传文件后副本文件保存在 *dist* 目录(不会自动删除,请手动删除)~~
> 2.0
* 船新版本 **不再产生副本文件** ,同名文件自动加上 `new Date().getTime() ` 毫秒串.
    ```
    fs.renameSync(oldPath: PathLike, newPath: PathLike)//同步可重命名,或移动文件
    ```
* 修复`Ubuntu`下目录出错问题,`ajax url` 传递的都是整个当前目录的地址,
* 修复手机页面异常,关于背景透明度问题,添加继承`opacity: inherit` ,
* 去除密码登录页(没删除,位置移动,连接直接打开页面).
* 新增创建文件夹,不能创建隐藏文件夹(文件夹名不可包含'.'或已存在或空).
* 新增所有文件内容下载.
* 手机浏览页面   
> 3.0 文件是否存在那里其实系统有自带函数(日后看情况再改)
* 
  ```
    const path = require("path")
    let str = path.resolve(process.argv[2])
    console.log(str)
    try {
        /**
        * http://nodejs.cn/api/fs.html#fs_fs_access_path_mode_callback
        * fs.constants.F_OK 是否存在
        * fs.constants.W_OK | fs.constants.R_OK 是否有读写权限
        */
        fs.access(str, fs.constants.F_OK, (err) => {
            if (err) {
                console.log("文件不存在")
                return
            }
            fs.stat(str, (err, stats) => {
                if (err) {
                    console.log(err.code)
                    return
                }
                if (stats.isDirectory()) {
                    console.log("是文件夹")
                    fs.readdir(str, (err, data) => {
                        if (err) throw err;
                        console.log(data)
                    })
                }
                if (stats.isFile()) {
                    console.log("是文件")
                    fs.readFile(str, "utf8", (err, data) => {
                        if (err) throw err;
                        console.log(data)
                    })
                }
            })
        })
    } catch (err) {
        console.log("不存在")
        console.log(err)

    }
  ```
* res.download(path)
![](/images/onphone.png)
* 上传页面
  
![](/images/up_file.png)
