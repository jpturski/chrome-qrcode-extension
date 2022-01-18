

// Chrome has a hardcoded popup window size limit of 800x600
var max_window_height = 200;
var max_qrcode_height = max_window_height - 75; // Reserve "some" space for UI

var qr_levels = ["M", "L"];
var qr_modules_by_version = {
  1: 21, 2: 25, 3: 29, 4: 33, 5: 37,
  6: 41, 7: 45, 8: 49, 9: 53, 10: 57
}

var createImage = function (payload) {
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

  var elements = document.getElementsByClassName("btn-product-specification");
  var skuElement = document.getElementsByClassName("productReference");

  if (elements.length > 0 && skuElement.length > 0) {
    elements[0].innerHTML = createImage(skuElement[0].innerText) || "Error. URL too long?";
  }
};

setTimeout(createInlineQrCodeOnPage(), 300);

