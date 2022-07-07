// Chrome has a hardcoded popup window size limit of 800x600
var max_window_height = 200;
var max_qrcode_height = max_window_height - 75; // Reserve "some" space for UI

var qr_levels = ["M", "L"];
var qr_modules_by_version = {
    1: 21, 2: 25, 3: 29, 4: 33, 5: 37,
    6: 41, 7: 45, 8: 49, 9: 53, 10: 57
};

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
    try {
        var localsToRender = document.getElementsByClassName("vtex-flex-layout-0-x-flexColChild vtex-flex-layout-0-x-flexColChild--info-product pb0");
        var qrCodeAreaToRender = null;

        if (localsToRender.length > 0) {
            for (var x = 0; x < localsToRender.length; x++) {
                if (localsToRender[x].children.length == 0)
                    qrCodeAreaToRender = localsToRender[x];
            }
        }

        var skuExtracted = null;

        if (location.pathname != null) {
            var parts = location.pathname.replace("/p", "").replace("/", "").split("-");

            if (parts.length > 0) {
                skuExtracted = parts[parts.length - 1];
                if (isNaN(skuExtracted))
                    skuExtracted = null;
            }
        }

        if (qrCodeAreaToRender != null && skuExtracted != null) {
            qrCodeAreaToRender.innerHTML = createQrCodeImage(skuExtracted || "Error. URL too long?");
        }
    } catch (e) {
    }
};

var removeHeaderCheckoutLinks = function () {
    try {
        var divMyAccount = document.getElementsByClassName("vtex-flex-layout-0-x-flexRowContent--header-login-minicart");
        var divMyCart = document.getElementsByClassName("vtex-flex-layout-0-x-flexRow--home-highlight--bar");
        var divPromocoes = document.getElementById("item-header-horizontal-promocoes");
        var divPromocoes2 = document.getElementById("item-header-promocoes");

        if (divMyAccount.length > 0) {
            for (var x = 0; x < divMyAccount.length; x++)
                divMyAccount[x].remove();
        }

        if (divMyCart.length > 0) {
            for (var x = 0; x < divMyCart.length; x++)
                divMyCart[x].remove();
        }

        if (divPromocoes != null)
            divPromocoes.remove();

        if (divPromocoes2 != null)
            divPromocoes2.remove();
    } catch (e) {
    }
};

var removeButtonsAddCart = function () {
    try {
        var btnsComprar = document.getElementsByClassName("vtex-button bw1 ba fw5 v-mid relative pa0 lh-solid br2 min-h-regular t-action bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary pointer w-100");

        if (btnsComprar.length > 0) {
            for (var x = 0; x < btnsComprar.length; x++)
                btnsComprar[x].remove();
        }


    } catch (e) {
    }
};

var removeFooter = function () {
    try {
        var footerLinks = document.getElementsByClassName("vtex-store-footer-2-x-footerLayout");

        if (footerLinks.length > 0) {
            for (var x = 0; x < footerLinks.length; x++)
                footerLinks[x].remove();
        }

        var footerLinks2 = document.getElementsByClassName("vtex-flex-layout-0-x-flexRow vtex-flex-layout-0-x-flexRow--newsletter");

        if (footerLinks2.length > 0) {
            for (var x = 0; x < footerLinks2.length; x++)
                footerLinks2[x].remove();
        }

    } catch (e) {
    }
};

var startKarstenKioskTransformation = function () {
    removeHeaderCheckoutLinks();
    removeFooter();
    removeButtonsAddCart();
    createInlineQrCodeOnPage();
    console.log("Fez o ajuste KIOSK " + Date());

    setTimeout(startKarstenKioskTransformation, 700);
};


document.addEventListener("DOMContentLoaded", startKarstenKioskTransformation());
