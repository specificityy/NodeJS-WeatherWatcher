var mainScript = function () {

   function getCityAndCountry(results) {
      var ret = [];
      for (var i = 0; i < results[0].address_components.length; i++) {
         var shortname = results[0].address_components[i].short_name;
         var longname = results[0].address_components[i].long_name;
         var type = results[0].address_components[i].types;

         if (type.indexOf("country") != -1 || type.indexOf("locality") != -1) {
            if (!isNullOrWhitespace(shortname)) {
               ret.push(shortname.replace(' ', '_'));
            } else {
               ret.push(longname.replace(' ', '_'));
            }
         }
         if (ret.length == 2)
            return ret;
      }
      return ret;
   }

   function isNullOrWhitespace(text) {
      if (text == null) {
         return true;
      }
      return text.replace(/\s/gi, '').length < 1;
   }

   function showErrorText() {
      document.getElementById('h2Error').setAttribute('class', 'displayBlock animated bounce')
   }

   return {
      locationSuccess: function (position) {
         var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         var geocoder = new google.maps.Geocoder();

         geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
               if (results[0]) {
                  var UserLocation = getCityAndCountry(results);
                  var redirectPath = [window.location.host, '/', UserLocation[1], '/', UserLocation[0]].join('');
                  console.log(redirectPath);
                  window.location.assign('//' + redirectPath);
               }
            }
         });
      },

      locationError: function error(msg) {         
         showErrorText();
      },

      showError: function () {
         // error message is shown 2 sec later so in case of a redirect, the user doesn't see the error
         setTimeout(showErrorText, 2000);
      }
   }
} ();

window.onload = function () {

   // try to get user's location if no valid route provided using HTML5 Geolocation
   var pathname = window.location.pathname || '';
   var isGetLocation = true;

   if (pathname != '' && pathname.length > 1) {
      pathname = pathname.charAt(0) == "/" ? pathname.substring(1) : pathname;

      isGetLocation = pathname.split('/').length < 2;
   }

   if (isGetLocation) {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(mainScript.locationSuccess, mainScript.locationError);
      } else {
         error('Browser does not support HTML5 Geolocation!');
      }
   }
};
