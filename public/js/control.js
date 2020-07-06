//navbar

$(window).on('load', () => {
    const navElements = document.querySelector('.navbar-nav').children,
        liElements = Array.from(navElements);
    liElements.forEach(ele => {
        if (window.location.pathname === $(ele.children).attr('href'))
            $(ele.children).addClass('nav-link-active');
    });
});

$('.navbar-toggler').click(() => {
    $('.nav-items-container').addClass('navbar-open-animate')
    setTimeout(() => $('.nav-items-container').addClass('navbar-open').removeClass('navbar-open-animate'), 1000);
});

$(".nav-link").click(e => {
    e.preventDefault();
    if (window.matchMedia('(max-width: 767px)').matches)
        setTimeout(() => window.location.pathname = $(e.target).attr('href'), 500);
    else
        window.location.pathname = $(e.target).attr('href');
});

$(document).click(e => {
    if (window.matchMedia('(max-width: 767px)').matches)
        if (!($(e.target).hasClass('navbar-no-toggle')))
            if ($('.nav-items-container').hasClass('navbar-open')) {
                $('.nav-items-container').addClass('navbar-close-animate').removeClass('navbar-open');
                setTimeout(() => $('.nav-items-container').removeClass('navbar-close-animate'), 1000);
            }
    if (!($(e.target).hasClass('keep-search-list-open')))
        $('.search-list').fadeOut(100);
});

//end navbar

$('.button').mouseout(e => $(e.target).removeClass('button-click'));

//text field validator

$('.text-field').on('blur', e => {
    if (e.target.value.trim() === '')
        $(e.target).nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
});

$('.text-field').on('keyup change', e => {
    if (e.which === 13) {
        $('button[type="submit"]').click();
        return;
    }
    if (e.target.value.trim() === '') {
        setTimeout(() => {
            if (e.target.value.trim() === '')
                $(e.target).nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        }, 500);
    } else
        $(e.target).nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
});

$('.number-text-field').on({
    'keydown': e => {
        if (isNaN(e.key) && e.which !== 8 && e.which !== 9)
            e.preventDefault();
    },
    'blur': e => numberTextFieldValidator($(e.target))
});

$('button[type="submit"]').on('click', e => {
    e.preventDefault();
    $('#' + $(e.target.form).attr('id')).submit();
});

function textFieldValidator(e) {
    e.preventDefault();
    let validated = true;
    $('.text-field').each(function () {
        if ($(this).val().trim() === '') {
            validated = false;
            $(this).keyup();
            $("html, body").animate({
                scrollTop: $(this).offset().top - 11 * $(window).height() / 100
            }, 500);
            $(this).focus();
            return false;
        } else if ($(this).hasClass("number-text-field")) {
            if (!numberTextFieldValidator($(this))) {
                validated = false;
                return false;
            }
        }
        return true;
    });
    if (!validated)
        return true;
    return false;
}

function numberTextFieldValidator(ele) {
    const value = ele.val().length,
        name = ele.attr('name');
    if (name === 'phNo') {
        if (value < 10 && value > 0) {
            ele.nextAll('.error-message').html('Enter valid 10 digit phone number').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            ele.nextAll('.error-message').html('This field is required').css('visibility', 'hidden');
            $(ele).keyup();
            return true;
        }
    } else if (name === 'pinCode') {
        if (value < 6 && value > 0) {
            $('.address-field-container .error-message').text('Enter valid 6 digit pin code').css('visibility', 'visible');
            $("html, body").animate({
                scrollTop: ele.offset().top - 11 * $(window).height() / 100
            }, 500);
            return false;
        } else {
            $('.address-field-container .error-message').text('Address cannot be blank').css('visibility', 'hidden');
            $(ele).keyup();
            return true;
        }
    }
    return true;
}

//button click styling

$('.button').on('click', e => {
    $(e.target).addClass('button-click');
});


//address validator

function validateAddress() {
    $('.address-field-container .error-message').text('Address cannot be blank');
    let valid = false;
    const requiredFields = ['Pin-Code', 'Taluk', 'District', 'State'],
        addressFields = Array.from($('.address-field-container').children(':not(.error-message)', 'input'));

    //if all fields are blank then don't check 
    //for each field
    //if any 1 field is filled then check for 
    //each field and if is in required fields 
    //then change error message and display

    if (!(addressFields.filter(ele => $(ele).val().trim() !== '').length === 0))
        addressFields.every((ele, i, arr) => {
            if ($(ele).val().trim() === '') {
                const placeholder = $(ele).attr('placeholder');
                if (requiredFields.includes(placeholder)) {
                    $('.address-field-container .error-message').text(`${placeholder} cannot be blank`);
                    valid = false;
                    return false;
                } else if (placeholder === 'Street/Road Name') {
                    if ($(arr[i + 1]).val().trim() === '') {
                        $('.address-field-container .error-message').text(`Both ${placeholder} and Area Name cannot be blank`);
                        valid = false;
                        return false;
                    }
                }
            } else if ($(ele).hasClass('.number-text-field')) {
                if (!numberTextFieldValidator($(ele))) {
                    valid = false;
                    return false;
                }
            }
            valid = true;
            return true;
        });
    if (!valid) {
        $('.address-field-container .error-message').css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: $('.address-field-container').offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    } else {
        $('.address-field-container .error-message').css('visibility', 'hidden');
        return true;
    }
}

//qualification operations

function updateQualification(checked, value) {
    let qualification = $('#advocate-sign-up-qualification'),
        list = qualification.val();
    if (checked) {
        list += `${value}, `;
        qualification.val(list);
        qualification.nextAll().css('visibility', 'hidden');
    } else {
        list = list.split(', ').slice(0, -1).filter(val => val !== value).sort();
        list.push('');
        qualification.val(list.join(', '));
    }
}

$('.qualification-selector-item').on('click', e => {
    let checked;
    if ($(e.target).hasClass('qualification-selector-item-selected'))
        checked = false;
    else
        checked = true;
    updateQualification(checked, $(e.target).text());
    $(e.target).toggleClass('qualification-selector-item-selected');
});

function validateQualification() {
    let qualification = $("#advocate-sign-up-qualification");
    if (qualification.val().trim() === '') {
        qualification.nextAll().css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: qualification.offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    }
    return true;
}

//password operations

$('.password-toggler').on('click', e => {
    const ele = $(e.target).attr('data-for');
    if ($(ele).attr('type') === 'password') {
        $(ele).attr('type', 'text');
        $(e.target).attr('src', './Icons/eye-slash-fill.svg')
    } else {
        $(ele).attr('type', 'password');
        $(e.target).attr('src', './Icons/eye-fill.svg')
    }
});

function validatePassword() {
    let p = $('#advocate-sign-up-password'),
        cp = $('#advocate-sign-up-confirmPassword');

    if (p.val() !== cp.val()) {
        cp.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'visible');
        $("html, body").animate({
            scrollTop: p.offset().top - 11 * $(window).height() / 100
        }, 500);
        return false;
    } else {
        cp.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
        return true;
    }
}

$('#advocate-sign-up-confirmPassword').on('keyup', () => {
    if (!$('#advocate-sign-up-password').val().includes($('#advocate-sign-up-confirmPassword').val()))
        validatePassword()
});

$('#advocate-sign-up-password').on('keyup', () => {
    if ($('#advocate-sign-up-confirmPassword').val() !== '' || $('#advocate-sign-up-password').val() === '')
        validatePassword()
});

$('#advocate-sign-up-confirmPassword').on('blur', () => validatePassword());

// start home.ejs

$("#advocate-login").submit((e) => {
    if (textFieldValidator(e)) {
        $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
        return;
    }
    $.ajax({
        url: '/validate',
        type: 'POST',
        data: {
            mail: $("#advocate-mail").val(),
            password: $("#advocate-password").val()
        },
        beforeSend: () => $('#login-load-button').next('img').css('visibility', 'visible'),
        success: function (response) {
            $('#login-load-button').next('img').css('visibility', 'hidden');
            if (response === 'success') {
                $("#advocate-login").unbind('submit').submit();
            } else
                $("#advocate-server-validation-error").text(response).css("visibility", "visible");
        }
    });
});

// end home.ejs
// start signUp.ejs

$('#advocate-sign-up').submit(function (e) {
    if (!textFieldValidator(e)) {
        if (!validateAddress() || !validateQualification() || !validatePassword()) {
            $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
            return;
        }
    } else {
        $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
        return;
    }
    $.ajax({
        url: '/sign-up/validate',
        type: 'POST',
        data: {
            mail: $("#advocate-sign-up-mail").val(),
            phNo: $("#advocate-sign-up-phNo").val()
        },
        beforeSend: () => $('#sign-up-load-button').next('img').css('visibility', 'visible'),
        success: function (response) {
            $('#sign-up-load-button').next('img').css('visibility', 'hidden');
            if (response === 'validated')
                $("#advocate-sign-up").unbind('submit').submit();
            else
                $("#advocate-server-validation-error").text(response).css("visibility", "visible");
        }
    });
});

// end signUp.ejs

//start dashboard

$('#profile-icon-holder').click(() => {
    if ($('.profile').hasClass('profile-open'))
        return;
    $(".profile").addClass('profile-display');
    setTimeout(() => $(".profile").addClass('profile-open').removeClass("profile-display"), 800);
    $('.hide-behind-profile').fadeOut(600);
    $('#profile-icon-holder').addClass('icon-clicked');
});

$('#profile-back-button-holder').click(() => {
    $('#profile-icon-holder').removeClass('icon-clicked');
    $(".profile").addClass('profile-hide');
    setTimeout(() => {
        $(".profile").removeClass('profile-open profile-hide');
        $('.hide-behind-profile').fadeIn();
    }, 700);
});

$('.search-bar').click(() => $('.search-list').fadeIn(100));

$('.search-bar').keyup(e => {
    const val = e.target.value.toLowerCase().trim();
    $('.search-list').empty();
    JSON.parse($("#clientList").text()).forEach(client => {
        const name = (client.fname + ' ' + client.lname).toLowerCase();
        if (val !== '' && name.includes(val))
            $('.search-list').append(`<h3 class = "search-list-item" data-id = "${client.clientId}" >${name}</h3>`);
    })
});

$(".search-list").on('click', '.search-list-item', e => {
    $('.search-list-selected-client p').remove();
    const clientId = $(e.target).attr('data-id'),
        client = JSON.parse($("#clientList").text()).filter(data => data.clientId == clientId)[0];
    $('.search-list-selected-client').prepend(`
        <p class="m-1" id="selected-client-name">Name : ${client.fname} ${client.lname}</p>
        <p class="m-1" id="selected-client-age">Age : ${client.age}</p>
        <p class="m-1" id="selected-client-fatherName">Father Name : ${client.fatherName}</p>
        <p class="m-1" id="selected-client-address">Address : ${client.address}</p>
        <p class="m-1" id="selected-client-phNo">ph-No : ${client.phNo}</p>
    `);
    $('.search-list-selected-client .client-open-icon').attr('data-id', client.clientId)
    $('.search-list-selected-client-container').fadeIn(100);
    $('.search-list-selected-client').delay(100).addClass('search-list-selected-client-open');
});

$('.search-list-selected-client-container').click(e => {
    if (!($(e.target).hasClass('search-list-selected-client'))) {
        $('.search-list-selected-client').removeClass('search-list-selected-client-open');
        $('.search-list-selected-client-container').delay(500).fadeOut(100);
        setTimeout(() => $('.search-bar').click(), 800);
    }
});

$('.horizontal-right-scroll-icon').click(() => {
    const scroll = $('.scrollable-box');
    scroll.animate({
        scrollLeft: scroll.scrollLeft() + 150
    });
});

$('.horizontal-left-scroll-icon').click(() => {
    const scroll = $('.scrollable-box');
    scroll.animate({
        scrollLeft: scroll.scrollLeft() - 150
    });
});

$('.client-detail').scroll(e => {
    if (e.target.scrollLeft > 0)
        $('.client-detail').removeClass('scroll-start');
    else
        $('.client-detail').addClass('scroll-start');
    if (e.target.scrollWidth - e.target.scrollLeft - parseInt($(e.target).outerWidth()) < 5)
        $('.client-detail').addClass('scroll-end');
    else
        $('.client-detail').removeClass('scroll-end');
    $('.client-detail').prop('scrollLeft', e.target.scrollLeft);
});

$(".scrollable-box").scroll(e => $('.scrollable-box').prop('scrollLeft', e.target.scrollLeft));
$('.client-open-icon').click(e => {
    $.ajax({
        url: '/client/',
        type: 'POST',
        data: {
            clientId: $(e.target).attr('data-id')
        },
        success: res => window.location.pathname = res
    });
});

//end dashboard

// start clientSignUp.ejs

$('#client-sign-up').submit(function (e) {
    if (!textFieldValidator(e)) {
        if (!validateAddress()) {
            $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
            return;
        }
    } else {
        $("#advocate-server-validation-error").text('Error').css("visibility", "hidden");
        return;
    }
    $.ajax({
        url: '/client/sign-up/validate',
        type: 'POST',
        data: {
            mail: $("#client-sign-up-mail").val(),
            phNo: $("#client-sign-up-phNo").val()
        },
        beforeSend: () => $('#client-sign-up-load-button').next('img').css('visibility', 'visible'),
        success: function (response) {
            $('#client-sign-up-load-button').next("img").css('visibility', 'hidden');
            if (response === 'validated')
                $("#client-sign-up").unbind('submit').submit();
            else
                $("#advocate-server-validation-error").text(response).css("visibility", "visible");
        }
    });
});

//end clientSignUp.ejs

// start clientData.ejs

//case operations

function displayBalance(where, amount) {
    $(`${where} .rupee-logo`).nextAll().remove();
    String(amount).split('').forEach(digit =>
        $(where).append(`<span class="mr-1 px-1 number-holder">${digit}</span>`).hide().fadeIn()
    );
}

function caseOpen(caseId) {
    // console.log($('#active-case-balance').children('.number-holder:not(.rupee-logo)'));
    $.ajax({
        url: '/client-data/case/open',
        type: "POST",
        data: {
            caseId
        },
        beforeSend: () => {
            $('#loading').fadeIn(300);
        },
        success: res => {
            $('#loading').hide();
            const caseDetails = JSON.parse(res);
            prepareRecord(caseDetails.recList.reverse());
            $("html, body").animate({
                scrollTop: $('.case-detail-container').offset().top - 50
            }, 700);
            setTimeout(() => {
                $('#active-case-title, #active-case-description').fadeOut(500);
                setTimeout(function () {
                    $('#active-case-title').html(caseDetails.caseTitle).fadeIn(500);
                    $('#active-case-description').html(caseDetails.caseDesc).fadeIn(500);
                }, 400);
                displayBalance('#active-case-balance', caseDetails.balance);
                loadDocuments(caseDetails.docList.reverse());
            }, 700);
        }
    });
}

function newCase() {
    const caseTitle = $('#new-case-title'),
        caseDesc = $('#new-case-description');

    caseTitle.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
    caseDesc.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');

    if (caseTitle.val().trim() === '') {
        caseTitle.nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        return;
    } else if (caseDesc.val().trim() === '') {
        caseDesc.nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        return;
    }
    $.ajax({
        url: "/client-data/case/new",
        type: "POST",
        data: {
            caseTitle: caseTitle.val(),
            caseDesc: caseDesc.val()
        },
        beforeSend: () => $(".new-case-container .loading-mini").fadeIn(300),
        success: res => {
            $(".new-case-container .loading-mini").fadeOut(100);
            $(".case-list").prepend(`<li class="my-2 case-list-item">
                    ${caseTitle.val()} &ensp;
                    <img
                        class="case-item-open-icon"
                        onclick="caseOpen('${res}')"
                        src="/Icons/box-arrow-up-right.svg"
                        alt="Open"
                    />
                    </li>`);
            $("#case-count").html(`No. of cases registered : &ensp; ${res}`);
            caseTitle.val('');
            caseDesc.val('');
            caseOpen(res);
        }
    });
};


//document operations

function loadDocuments(list) {
    const checkBox = status => {
            if (status)
                return `<input class="mr-3 mt-1 doc-check-icon doc-check-icon-checked" type="checkbox" />`
            else
                return `<input class="mr-3 mt-1 doc-check-icon " type="checkbox" />`
        },
        docList = $("#document-list"),
        icon = "/Icons/file-earmark-minus.svg";

    docList.slideUp(300);
    setTimeout(() => {
        docList.empty();
        list.forEach(doc => {
            docList.append(`<li class="my-2 doc-list-item" data-status="${doc.status}">${checkBox(doc.status)}${doc.docName} &ensp; <img class="doc-del-icon" src=${icon} alt="Delete" /></li>`)
        });
        docList.slideDown(300);
    }, 250);
}

function documentOperation(docName, status) {
    $.ajax({
        url: '/client-data/document',
        type: "POST",
        data: {
            docName,
            status
        },
        beforeSend: () => $('.doc-list-container .loading-mini').fadeIn(300),
        success: res => {
            $('.doc-list-container .loading-mini').fadeOut(300);
            loadDocuments(JSON.parse(res));
        }
    });
}

function newDocument() {
    const doc = $("#new-doc-name");
    doc.nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
    if (doc.val().trim() === '') {
        doc.nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        return;
    }
    documentOperation(doc.val(), 2);
    doc.val('');

}

$("#document-list").on('click', '.doc-del-icon', e => {
    const docName = $(e.target).parent().text().trim();
    documentOperation(docName, -1);
});

$("#document-list").on('click', '.doc-check-icon', e => {
    const ele = $(e.target);
    const docName = ele.parent().text().trim(),
        status = ele.parent().attr('data-status') === 'true' ? 0 : 1;
    documentOperation(docName, status);
});

//record operations

function slideTransactionTop() {
    $('html, body').animate({
        scrollTop: $('.transaction-history-container').offset().top - 50
    }, 500);
}

function recordItemGenerator(rec) {
    return (
        `<div class="row ml-3 mr-1 mb-3 pb-2 transaction-history-item">
        <h5 class="col-5 col-sm-2 mr-2 mt-1 p-0 transaction-date"><img onclick="deleteRecord('${rec._id}')" class="mr-1 transaction-del-icon" src="/Icons/trash.svg" alt="Delete" /> ${rec.date}</h5>
        <div class="ml-3 ml-sm-2 p-0 col scrollable-box">
          <p class="m-0 p-0 scrollable-item transaction-purpose">
            ${rec.purpose}
          </p>
          <h5 class="ml-3 ml-sm-4 p-0 scrollable-item transaction-amount">
            &#8377; ${rec.amount}
          </h5>
        </div>
      </div>`
    )
}

function prepareRecord(rec, from = null) {
    $(".transaction-history").hide().empty();
    $(".transaction-history-header").removeClass("transaction-history-header-clicked");
    let clientRec = $("#client-record-list"),
        advocateRec = $("#advocate-record-list");
    rec.forEach(each => {
        each.date = new Date(each.date).toLocaleDateString();
        if (each.paid_by.trim() === 'a')
            advocateRec.append(recordItemGenerator(each));
        else
            clientRec.append(recordItemGenerator(each));
    });
    if (from === 'a')
        $("#advocate-transaction-history").click();
    else if (from === 'c')
        $("#client-transaction-history").click();
}

$(".transaction-history-header").click(e => {
    $(".transaction-history-header").removeClass("transaction-history-header-clicked");
    $(e.target).addClass('transaction-history-header-clicked');
});

function displayTransactionHistory(id) {
    slideTransactionTop();
    $(`${id} .transaction-history-item`).each(function () {
        $(this).hide();
    });
    $(id).show();
    $(`${id} .transaction-history-item`).each(function (i) {
        $(this).delay(150 * i).fadeIn(400);
    });
}

$("#advocate-transaction-history").click(() => {
    $("#advocate-transaction-history").addClass('transaction-history-header-clicked');
    $('#client-record-list').hide();
    displayTransactionHistory("#advocate-record-list");
});

$("#client-transaction-history").click(() => {
    $("#client-transaction-history").addClass('transaction-history-header-clicked');
    $('#advocate-record-list').hide();
    displayTransactionHistory("#client-record-list");
});

$(".new-record-from").click(e => {
    $(".new-record-from").removeClass("new-record-from-clicked");
    $(e.target).addClass("new-record-from-clicked");
});

function newRecord() {
    const ele = '#new-record-',
        date = $(ele + "date"),
        purpose = $(ele + "purpose"),
        amount = $(ele + "amount"),
        paid_by = $(".new-record-from.new-record-from-clicked").attr("data-from");

    $(`${ele}date, ${ele}purpose, ${ele}amount`).nextUntil('.password-toggler', ':not(.text-field-placeholder)').css('visibility', 'hidden');
    if (date.val().trim() === '') {
        date.next('.error-message').css('visibility', 'visible');
        return;
    }
    if (purpose.val().trim() === '') {
        purpose.nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        return;
    }
    if (amount.val().trim() === '') {
        amount.nextAll(':not(.text-field-placeholder)').css('visibility', 'visible');
        return;
    }
    $.ajax({
        url: "/client-data/record/new",
        type: "POST",
        data: {
            paid_by,
            date: date.val(),
            purpose: purpose.val(),
            amount: parseInt(amount.val())
        },
        beforeSend: () => $('#new-record-container .loading-mini').fadeIn(300),
        success: res => {
            $('#new-record-container .loading-mini').fadeOut(100);
            $(`${ele}date, ${ele}purpose, ${ele}amount`).val('');
            const data = JSON.parse(res);
            displayBalance('#active-case-balance', data.balance);
            displayBalance('#total-balance', data.totalBalance);
            slideTransactionTop();
            setTimeout(() => prepareRecord(data.recList.reverse(), paid_by), 500);
        }
    });
}

function deleteRecord(id) {
    $.ajax({
        url: "/client-data/record/delete",
        type: "POST",
        data: {
            id
        },
        beforeSend: () => {
            slideTransactionTop();
            $('.transaction-history-container .loading-mini').fadeIn(300)
        },
        success: res => {
            $('.transaction-history-container .loading-mini').fadeOut(100);
            data = JSON.parse(res);
            displayBalance('#active-case-balance', data.balance);
            displayBalance('#total-balance', data.totalBalance);
            if ($("#advocate-transaction-history").hasClass('transaction-history-header-clicked'))
                prepareRecord(data.recList.reverse(), 'a');
            else
                prepareRecord(data.recList.reverse(), 'c');
        }
    });
}