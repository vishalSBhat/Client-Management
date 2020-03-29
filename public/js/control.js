// start home.ejs

$("input").focus((event) => {
    $(event.target).removeClass("box-empty-red");
});

$(".signUp button").on("click", () => {
    $(".dummyForm input:first-of-type").val("NULL");
    $(".dummyForm").submit();
});

function verify()
{
    let temp = $(".dummy").contents().find("div:first-of-type").attr("data-verify");
    let id = $(".dummy").contents().find("div:last-of-type").attr("data-id");
    $(".dummy").attr("src", "");
        if(temp === "YES"){
            $(".dummyForm input:last-of-type").val(id);
            $(".dummyForm").submit();
        }
        else if(temp !== "")
        $(".signIn-box p").html(temp).css("display", "block");
}

// end home.ejs

// start signUp.ejs

function verify1(){
    let temp = $(".dummy1").contents().find("div").attr("data-verify");
    $(".dummy").attr("src", "");
    if(temp === "YES"){
        $(".dummy1Form").submit();
    }
    else if(temp === "NO")
    $(".signUp-box p").css("display", "block");
}

$(".passToggle").on("click", (event) => {
    let temp = $("#pass");
    if (temp.attr("type") === "password") {
        temp.attr("type", "text");
        $(".passToggle").attr("src", "/images/hide.jpg");
    } else {
        temp.attr("type", "password");
        $(".passToggle").attr("src", "/images/visible.jpg");
    }
});

function passAlert() {
    $(".passC").remove();
    var pass = $("#pass").val();
    var passC = $("#passC").val();
    if (!(pass === passC)) {
        $("#passC").after('<h5 class="passC err-msg">Re-confirm password wrong</h5>');
        return false;
    }
    return true;
}

var errObject;

function signButton() {
    $("#error").remove();
    $(errObject).removeClass("box-empty-red m25 inline");
    if ($(".email").val() === "NULL")
        return true;
    var inputs = $(".box").toArray();
    for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].value === "") {
            errObject = inputs[i];
            $(inputs[i]).addClass("box-empty-red m25 inline");
            if ($(errObject).attr("id") === "pass")
                $(".passToggle").after('<img src="/images/error.jpg" class="error-img mr-0" id="error" alt="Error">');
            else
                $(errObject).after('<img src="/images/error.jpg" class="error-img mr-0" id="error" alt="Error">');
            return false;
        }
    }
    if (!passAlert()) {
        errObject = "passC";
        return false;
    }
    return true;
}

// end signUp.ejs

// start accountPage.ejs

var list, temp1;

function accountPage() {
    list = JSON.parse($(".contactList").attr("data-value"));
}


$(".clientName").keydown((event) => {
    $(".contactList").empty();
    setTimeout(() => {
        temp1 = [];
        var phNo = $(".clientName").val();
        if (phNo === "")
            temp1 = [];
        else {
            list.forEach((item, index) => {
                if (item.name.search(new RegExp(phNo, "i")) !== -1) //in js u have indexof method instead of includes
                    temp1.push(item);
            });
        }
        for (let i = 0; i < temp1.length; ++i) {
            $(".contactList").append('<input type="text" class="dBlock mAuto contactListItems" value="' + temp1[i].name + '" onclick=autoFill('+ i +') readonly/>');
        }
    }, 10);
});

function autoFill(value) {
    $(".contactList").empty();
    $(".clientName").val(temp1[value].name).focus();
    $("form input:last-of-type").val(temp1[value]._id);
    $("form").submit();
}

$(".newClient-btn").on("click", () => {
    $(".clientName").val("NULL");
    $("form").submit();
    $(".clientName").val("");
});

// end accountPage.ejs

// start clientSignUp.ejs

function verify2(){
    let temp = $(".dummy2").contents().find("div").attr("data-verify");
    $(".dummy2").attr("src", "");
    if(temp === "YES"){
        $(".dummy2Form").submit();
    }
    else if(temp !== "")
    $(".dummy2").prev().find("p:last-of-type").html(temp).css("display", "block");
}

//end clientSignUp.ejs

// start clientData.ejs

function verify3(){
}


var id;
$(".caseList h4").click((event) => {
    popClose();
    id = event.target.id;
    let active = $("#activeCaseIndex").val().trim();
    const style = "display: block"
    $("#p" + id).attr("style", style);
    $(".caseDescBox").attr("style", style);
    if(id !== active)
    $("#p" + id).after('<button type="button" class="btn btn-lg btn-light" id="openCase">Open Case</button>');
    $("body > *:not(.caseDescBox)").css("filter", "blur(2px)");
});

$(".caseDescBox").on("click", "#popClose", () => {
    popClose();
});

function popClose() {
    const style = "display: none";
    $(".caseDescBox").attr("style", style);
    $("#p" + id).attr("style", style);
    $("#openCase").remove();
    $("body > *:not(.caseDescBox)").css("filter", "");
}

$(".caseDescBox").on("click", "#openCase", () => {
    console.log("a");
    console.log($("#openCase").next().val());
    $(".caseControl input:first-of-type").val($("#openCase").next().val());
    $(".caseControl").submit();
});

$(".a").on("click", () => {
    justClose();
    $(".a").css("background-color", "#f1f3f4");
    $(".b").css("background-color", "");
    $(".clientRec").slideUp();
    $(".advocateRec").slideDown();
    $("html, body").animate({
        scrollTop: $(".recDisplay").offset().top
    }, 500);
});

$(".b").on("click", () => {
    justClose();
    $(".b").css("background-color", "#f1f3f4");
    $(".a").css("background-color", "");
    $(".advocateRec").slideUp();
    $(".clientRec").slideDown();
    $("html, body").animate({
        scrollTop: $(".recDisplay").offset().top
    }, 500);
});


function newCase() {
    $(".newCase").css("display", "block");
    $("body > *:not(.c)").css("filter", "blur(2px)");
}

$("#newCaseClose").on("click", () => {
    const style = "display: none";
    $(".c").attr("style", style);
    $("body > *:not(.c)").css("filter", "");
});

function justClose() {
    $(".newRec").slideUp();
}

function justOpen(value) {
    $(".newRec input[type='text'], .newRec textarea").val("");
    $("#newRecord").val(value)
    $(".newRec h2").html("Paid By " + value);
    $(".newRec").slideDown();
    $("html, body").animate({
        scrollTop: $(document).height()
    }, 500);
}

$(".advocateRec button").on("click", () => {
    justOpen("You");
});

$(".clientRec button").on("click", () => {
    justOpen("Client");
});

$(".newRec img").on("click", () => {
    justClose();
});

function newRecSubmit() {
    $("#validAmount").remove();
    if(isNaN($(".newRec input:nth-of-type(3)").val())){
        $(".newRec input:nth-of-type(3)").after("<span id='validAmount' class='mx-4 mt-2 dBlock' style='color: red;'>Enter valid amount !!</span>");
        return false;
    }
    var d = new Date($(".newRec input:nth-of-type(2)").val());
    MyDateString = ('0' + d.getDate()).slice(-2) + '/' +
        ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
        d.getFullYear();
    let date = '<div class="col-3 titem">' + MyDateString + '</div>';
    let purpose = '<div class="col-6 titem">' + $(".newRec textarea").val() + '</div>';
    let amount = '<div class="col-3 titem"><b>' + $(".newRec input:nth-of-type(3)").val() + '</b><img src="/images/trash.png" alt="Delete" class="delete"></div>';
    let data = ' <div class="row mAuto tbody">' + date + purpose + amount + '</div>';
    let balance;
    if ($("#newRecord").val() === "You"){
        balance = parseInt($("#recordBalance b").html()) + parseInt( $(".newRec input:nth-of-type(3)").val());
        $(".advocateRec button").before(data);
    }
    else{
        balance = parseInt($("#recordBalance b").html()) - parseInt( $(".newRec input:nth-of-type(3)").val());
        $(".clientRec button").before(data);
    }
    justClose();
    $(".newRec input:nth-of-type(2)").val(MyDateString);
    $("#recordBalance b").html(balance);
    if(!($(".advocateRec").find(".tbody") === null))
    $("#noRecordShow1").css("display", "none");
    if(!($(".clientRec").find(".tbody") === null))
    $("#noRecordShow2").css("display", "none");
    return true;
}

$(".advocateRec, .clientRec").on("mouseenter", ".tbody", (e) => {
    if (!(window.matchMedia('(max-width: 768px)').matches))
    $($(e.target).parent()).find(".delete").show();
});

$(".advocateRec, .clientRec").on("mouseleave", ".tbody", (e) => {
    if (!(window.matchMedia('(max-width: 768px)').matches))
    $($(e.target).parent()).find(".delete").hide();
});

var temp;
$(".advocateRec, .clientRec").on("click", ".delete", (e) => {
    let t = $($(e.target).parent().parent());
    temp = e.target.parentNode.parentNode;
    if($(t.parent()).attr("class") === "advocateRec")
    $("#deleteRec input:nth-child(1)").val("You");
    else
    $("#deleteRec input:nth-child(1)").val("Client");
    $("#deleteRec input:nth-child(2)").val(t.find(":nth-child(1)").html());
    $("#deleteRec input:nth-child(3)").val(t.find(":nth-child(2)").html());
    $("#deleteRec input:nth-child(4)").val(t.find(":nth-child(3) b").html());
    $(".deleteAlert").css("display", "block");
    $("body > *:not(.c)").css("filter", "blur(1px)");
});

$(".deleteAlert div button").on("click", (ev) => {
    if ($(ev.target).html() === "Yes") {

        $('#deleteRec').submit();
        let bal;
        if($("#deleteRec input:nth-child(1)").val() === "You")
        bal = parseInt($("#recordBalance b").html()) - parseInt($(temp).find("div:last-of-type").text());
        else
        bal = parseInt($("#recordBalance b").html()) + parseInt($(temp).find("div:last-of-type").text());
        $("#recordBalance b").html(bal);
        temp.remove();
    }
    $(".deleteAlert").css("display", "none");
    $("body > *:not(.c)").css("filter", "");
    if($(".advocateRec").find(".tbody").length === 0)
    $("#noRecordShow1").css("display", "block");
    if($(".clientRec").find(".tbody").length === 0)
    $("#noRecordShow2").css("display", "block");
});

function justSet(){
    let id1 = "remDoc"+($("#docList div").length+1);
    let id2 = "div"+($("#docList div").length+1);
    let newDoc = '<div class="m-2"><p style="display: inline-block" id='+id2+' class="my-2 mx-lg-3" data-status="2"><img src="/images/arrow.png" class="mr-lg-5 mr-2">'+$('#docList form input:nth-of-type(3)').val()+'</p><img id='+id1+' class="removeDoc" src="/images/minus.png" alt="Remove" style="display: none;"></div>'
    $("#docList form").before(newDoc);
    $("#docList form input:nth-of-type(2)").val("2");
}

$("#docList").on("click", "div p", (e) => {
    let target, status;
    if(e.target.nodeName === "IMG")
    target = $(e.target).parent();
    else
    target = $(e.target);
    status = target.attr("data-status");
    $("#docList form input:first-of-type").val($(target).text());
    $("#docList form input:nth-of-type(3)").val(" ");
    if (status === "true") {
        $("#docList form input:nth-of-type(2)").val("0");
        $(target).find("img:last-child").remove();
        $(target).attr("data-status", "false");
        $("#docList form").submit();
    } else {
        $("#docList form input:nth-of-type(2)").val("1");
        $(target).append('<img class="check ml-2 mb-2" src="/images/check.png">');
        $(target).attr("data-status", "true");
        $("#docList form").submit();
    }
});


$("#docList").on("mouseenter", "div p", (e) => {
    let temp = e.target.id.slice(-1);
    if (!(window.matchMedia('(max-width: 768px)').matches))
    $("#remDoc"+temp).css("display", "inline");
});

$("#docList").on("mouseleave", "div", (e) => {
    if(e.target.nodeName === "DIV"){
        let temp = $(e.target).children("p").attr("id").slice(-1);
        if (!(window.matchMedia('(max-width: 768px)').matches))
        $("#remDoc"+temp).css("display", "none");
    }
});

$("#docList").on("click", ".removeDoc", (e) => {
    let temp = $(e.target).attr("id").slice(-1);
    $("#docList form input:first-of-type").val($("#div"+temp).text());
    $("#docList form input:nth-of-type(2)").val("-1");
    $("#docList form input:nth-of-type(3)").val(" ");
    $("#div"+temp).parent().remove();
    $("#docList form").submit();
});

function newDoc(){
    let docName = $("#docList form input:nth-of-type(3)");
    if(docName.val() === ""){
        docName.addClass("box-empty-red inline").after('<img src="/images/error.jpg" class="error-img mr-0" id="error" alt="Error">');
        return false;
    }
    else{
        if($("#docList form input:nth-of-type(2)").val() !== "2"){
            docName.val("");
            return true;
        }
        $("#docList form input:first-of-type").val(docName.val());
        docName.val("");
        return true;
    }
}

$("#docList form input:nth-of-type(3)").click((e) => {
    $(e.target).removeClass("box-empty-red inline");
    $("#error").remove();
});



// $(function() {
//     $('.docList').submit(function(event) {
//         event.preventDefault();
//         var doc = $(".docList input").val();
//         if(doc === "")
//         $(".docList input").after('<h5>This field cannot be blank</h5>');
//         else{
//             $.post('/docAdd', {doc: doc});
//             $(".docList input").before('<h4>"'+doc+'"</h4>'); 
//             $(".docList input").val("");       
//     }
//     });
// });