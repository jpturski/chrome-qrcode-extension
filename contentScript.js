

// Chrome has a hardcoded popup window size limit of 800x600
var max_window_height = 200;
var max_qrcode_height = max_window_height - 75; // Reserve "some" space for UI

var qr_levels = ["M", "L"];
var qr_modules_by_version = {
    1: 21, 2: 25, 3: 29, 4: 33, 5: 37,
    6: 41, 7: 45, 8: 49, 9: 53, 10: 57
}

var createQrCodeImage = function (payload) {
    var qr_margin = 4;

    for (var levelIndex in qr_levels) {
        for (var typeNum = 1; typeNum <= 10; typeNum++) {
            var qr_cellsize = Math.floor(max_qrcode_height / qr_modules_by_version[typeNum]);
            try {
                var qr = qrcode(typeNum, qr_levels[levelIndex]);
                qr.addData(payload);
                qr.make();
                return qr.createImgTag(qr_cellsize, qr_margin);
            } catch (e) {
                if (strStartsWith(e.message, "code length overflow")) {
                    // ignore and try to use bigger QR code format
                } else {
                    throw e;
                }
            }
        }
    }
};

var createInlineQrCodeOnPage = function () {
    var qrCodeAreaToRender = document.getElementsByClassName("section-buy");
    var skuElement = document.getElementsByClassName("productReference");

    if (qrCodeAreaToRender.length > 0 && skuElement.length > 0) {
        qrCodeAreaToRender[0].innerHTML = createQrCodeImage(skuElement[0].innerText) || "Error. URL too long?";
    }
};

var removeHeaderCheckoutLinks = function () {
    var divMyAccount = document.getElementsByClassName("header__section-user");
    var divMyCart = document.getElementsByClassName("header__section-bag");
    var divPromocoes = document.getElementsByClassName("promocoes");

    if (divMyAccount.length > 0) {
        for (var x = 0; x < divMyAccount.length; x++)
            divMyAccount[x].remove();
    }

    if (divMyCart.length > 0) {
        for (var x = 0; x < divMyCart.length; x++)
            divMyCart[x].remove();
    }

    if (divPromocoes.length > 0) {
        for (var x = 0; x < divPromocoes.length; x++)
            divPromocoes[x].remove();
    }
};

var removeFooter = function () {
    var footerLinks = document.getElementsByClassName("footer-inst");
    var footerInfo = document.getElementsByClassName("informacoes");

    if (footerLinks.length > 0) {
        for (var x = 0; x < footerLinks.length; x++)
            footerLinks[x].remove();
    }

    if (footerInfo.length > 0) {
        for (var x = 0; x < footerInfo.length; x++)
            footerInfo[x].remove();
    }
}


var startKarstenKioskTransformation = function () {
    removeHeaderCheckoutLinks();
    createInlineQrCodeOnPage();
    removeFooter();
};

setTimeout(startKarstenKioskTransformation(), 300);

