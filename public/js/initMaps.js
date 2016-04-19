$(document).ready(function(){
    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 5,
        format: 'd mmmm, yyyy'
    });
    $('.timepicker').pickatime({
        interval: 15,
        closeOnSelect: true
    });
    var usrLat, usrLong;
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position){
            usrLat = position.coords.latitude;
            usrLong = position.coords.longitude;

            // Create a map object and specify the DOM element for display.
            map = new GMaps({
                div: '#map',
                lat: usrLat,
                lng: usrLong
            });
            map.addMarker({
                lat: usrLat,
                lng: usrLong
            });
        });
    }
    
    $('#gmapsFindLocation').click(function(e){
        e.preventDefault();
        $('#eventFrmtAdd').html('');
        $('#eventLocality').html('');
        Materialize.toast('Fetching location...',200);
        GMaps.geocode({
            address: $('#eventLocation').val().trim(),
            callback: function(results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    map.setCenter(latlng.lat(), latlng.lng());
                    map.addMarker({
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    });
                    $('#eventLat').val(latlng.lat());
                    $('#eventLng').val(latlng.lng());
                    var arrAddress = results[0].address_components;
                    var itemLocality='';
                    $.each(arrAddress, function (i, address_component) {
                        if (address_component.types[0] == "locality"){
                            itemLocality = address_component.long_name;
                        }
                    });
                    if (!$('#eventFrmtInf').is(':visible')){
                        $('#eventFrmtInf').fadeIn();
                    }
                    $('#eventLocality').append('Town/locality: '+itemLocality);
                    $('#eventGeoloc').val(itemLocality);
                } else{
                    Materialize.toast('Something went wrong...');
                }
            }
        });
    });
});

