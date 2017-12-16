window.fbAsyncInit = function () {
    FB.init({
        appId: '798627927008329',
        autoLogAppEvents: true,
        xfbml: false,
        version: 'v2.11'
    });

    /*Thực hiện chức năng share. Truyền vào 1 objetc và 1 callback*/
    // FB.ui(
    //     {
    //         method: 'share',
    //         href: 'https://www.youtube.com/watch?v=Qs-XcmaxaLw'
    //     }, function(response){
    //         console.log("Share!");
    //         console.log("response: " + response);
    //     });

    /*Thực hiện chức năng login*/
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log("Logged in!");
        } else {
            console.log("Please loggin!");
            FB.login(function () {
                // FB.api('/me/feed', 'post', {message: 'Hello, world!'});
            }, {scope: 'publish_actions'});
        }

    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/vi_VN/sdk.js";//Thiết lập ngôn ngữ
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


//publish_actions :để thực hiện lệnh gọi API đăng
function myFacebookLogin() {

    FB.login(function () {
        // FB.api('/me/feed', 'post', {message: 'Hello, world!'});
    }, {scope: 'publish_actions'});

}


function getComments() {



    var idPost = getIDPost();
    if (idPost == undefined) {
        document.getElementById('thong-bao').style.display = 'block';
        return
    }
    document.getElementById('thong-bao').style.display = 'none';
    console.log("ID post: " + idPost);
    FB.api(
        "/" + idPost + "/comments", //truyền vào id 1 bài viết
        {
            'limit': 700
        },
        function (response) {
            if (response && !response.error) {
                /* handle the result */
                // console.log(response);
                listComments = response;
                generate();
                document.getElementById('nhan-dang').style.display = 'none';
            } else {
                document.getElementById('nhan-dang').style.display = 'block';
                console.log("Error khi lấy comment")
                console.log(response.error);
            }
        }
    );


}

var listComments = []; //Mảng lưu respon trả về
var listInfo = [];//Mảng lưu các comment ở dạng thô, chưa chuẩn hóa email


function generate() {


    console.log("List comment!");
    // console.log(listComments.data);
    // var contents = listComments.data[0];
    // // var message
    // console.log(contents);
    // var user = listComments.data[0].from;
    // console.log(user);

    for (var i = 0; i < listComments.data.length; i++) {
        // content.created_time = listComments.data[i].created_time;
        // content.name = listComments.data[i].from.name;
        // content.idUser = listComments.data[i].from.id;
        // content.idComment = listComments.data[i].id;
        // content.message = listComments.data[i].message;

        var hasEmail = false;
        var message = listComments.data[i].message.replace(/\n/g, ' ');
        var arrWords = message.split(' ');
        arrWords.forEach(function (word) {
            word = word.replace(/[\W|_]$/, '');
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (word.search(regex) > -1) {
                message = word.toLowerCase();
                hasEmail = true;
            }
        });

        if (hasEmail) {
            /*Tại sao không thể push content vào mảng listInfo*/
            listInfo.push({
                created_time: listComments.data[i].created_time,
                idUser: listComments.data[i].from.id,
                name: listComments.data[i].from.name,
                idComment: listComments.data[i].id,
                message: message
            });
        }



    }


    console.log("Mảng: ");
    console.log(listInfo);
    showData(listInfo);
}



//Hàm thực hiện lấy id của bài viết
function getIDPost() {
    var linkPost = document.getElementById('link-post').value;
    if (linkPost.length <= 0) {
        document.getElementById('thong-bao').style.display = 'block';
        return;
    }
    document.getElementById('thong-bao').style.display = 'none';
    console.log("Get id Post")
    var arr = linkPost.split('/');
    var idPost = arr[arr.length - 2];
    console.log(idPost)
    return idPost;
}


function showData(listUser) {
    console.log("Data length: " + listUser.length)
    var myTable = document.getElementById('mytable');
    for (var i = 0; i < listUser.length; i++) {
        var time = new Date(listUser[i].created_time);
        myTable.innerHTML +=
            '<tr>' +
            '<td>' + time.getHours() + ":" + time.getMinutes() + "  " + time.getDay() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear() + '</td>' +
            '<td><a href="https://www.facebook.com/' + listUser[i].idUser + '" target="_blank">' + listUser[i].name + '</a></td>' +
            '<td>' + listUser[i].message + '</td>\n' +
            '</tr>'
    }
}

function coppyLink() {
    var copyText = document.getElementById("coppy-link");
    copyText.select();
    document.execCommand("Copy");
    setTimeout(function () {
        document.getElementById('coppied').style.display = 'block';
    });
    setTimeout(function () {
        document.getElementById('coppied').style.display = 'none';
    }, 1000);

}


