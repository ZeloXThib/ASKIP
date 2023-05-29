

var url = 'http://eislert.fr/glisse/2.0/app/';
var msg = '[info]';
var err = '[Error]';


var app = angular.module('skiApp', ['ngRoute','angular-toArrayFilter'])
.config(function($routeProvider, $sceProvider) {
    $sceProvider.enabled(false);
    $routeProvider 
        .when("/station/:stationUid", { 
            templateUrl : "strct/station.html" 
        })  
        .when("/home/",{
            templateUrl : "strct/home.html"
        }) /*
        .when("/ete/",{
            templateUrl : "pages/ete.html"
        }) */
        .when("/insc/",{
            templateUrl : "strct/insc.html"  
        })
        .otherwise ({ 
            templateUrl : "strct/connexion.html"  //pages/home.html
        })
    })  




.controller('mainCtrl', function mainCtrl($scope, $http, $route, $routeParams) {
    
    this.$route = $route;
    this.$routeParams = $routeParams;   

    $scope.local = new Array();
    $scope.local.user = 0;
    $scope.assets = new Array();

    $scope.stations = new Array();


    $http({
        method: 'GET',
        url: 'http://eislert.fr/glisse/2.0/station.json',
        }).then(function(response) {

            var _uid = 1;
            response.data.forEach(station => {
                $scope.stations[_uid] = station;  
                _uid++;
            });

            console.log($scope.stations);  
    }  );   


    $scope.isLogged = function() {
        if ($scope.local['user'] == 0) {
            $scope.goTo('connexion'); 
        } 
    } 


    $scope.client = function(action){

        if (action == 'logout') {
            // on déconnecte l'user
            $scope.local['user'] = 0; 
            $scope.goTo('connexion'); 
            $scope.dispAlert('succes', 'Au revoir !');  
            return true;
        } 

        $scope.closeAlert(); 
        console.log(msg + 'Regiistering client ... '); 
        $http({
            method: 'POST',
            url: url + 'registerclient.php',
            data: {
                action: action,
                user_mail: $('#email-' + action).val(),
                user_password: $('#mdp-' + action).val()
            } 
        }).then(function(response){

            console.log(msg + ' user system : ' + response.data);

            var _rep = response.data;
            console.log(msg + ' user system : ' + _rep.header + ' - ' + _rep.state);

            // La reponse revient d'une action de login ?
            if (_rep.header == 'login') {
 
                // Si le login est réussi 
                if (_rep.state == 200) {
                    $scope.local['user'] = _rep.data;  
                    $scope.goTo('home'); 

                // sinon on renvoit une erreur
                } else {
                    $scope.dispAlert('error', 'Mauvais identifiant ou mot de passe.');

                } 

            // ou la réponsse revient d'une action de regisster
            } else if (_rep.header == 'register') {
                // Si le register est réussi 
                if (_rep.state == 200) {
                    $scope.goTo('connexion');
                    $scope.dispAlert('succes', 'Utilisateur enregistré !');

                // sinon on renvoit une erreur
                } else {
                    $scope.dispAlert('error', 'Email déjà utilisé.'); 

                }
            }


    
        }) // fin du then
    }


    $scope.goTo = function(page) {
        location.href = '#!' + page; 
    }
    

    $scope.dispAlert = function(type, message) {
        $('#alert').show();  
        $('#alert-message').html('<i class="fa fa-exclamation-triangle"> ' + message);
    } 
    $scope.closeAlert = function() {
        $('#alert').hide(); 
        $('#alert-message').html('');
    }

    $scope.syncDelay = function(milliseconds){
        
    }

    $scope.gotoStation = function(station_uid) {

        // Change la view pour afficher la fiche
        location.href = '#!station/' + station_uid; 
    
    }

    $scope.goToConnexion = function(){
        location.href = '#!';
    }

    $scope.goToInscription = function(){
        location.href = '#!/inscription/';
    }

    $scope.goToAccueil = function(){
       location.href = '#!/home/';
    }

    $scope.goToEte = function(){
        var start = new Date().getTime();     
        var end=0;     
        while( (end-start) < 1000){        
            end = new Date().getTime();     
        }       
        location.href = '#!/ete/';
    }
   /*

    $scope.transformNameInSize = function(station_name) {
        var size;
        if (station_name.length > 13){
            console.log(station_name.length);
            size = '10%';
        }
        else{
            size =  '120%';
        }
        console.log(size);
        return size;
    }
*/
    $scope.color = function(weather) {
        var color;
        if(weather == 'cloud'){
            color = 'gray';
        }else if (weather == 'sun'){
            color = 'orange';
        }else if (weather == 'cloud-sun'){
            color = '#fdd85d';
        }else if (weather == 'smog'){
            color = '#0d0807';
        }else if (weather == 'smog'){
            color = '#268aa5';
        }else if (weather == 'snowflake'){
            color = '#94e4f7';
        }else if (weather == 'cloud-sun-rain'){
            color = '#d0d0d0';
        }else if (weather == 'cloud-rain'){
            color = '#243b79';
        }

        console.log(weather);
        console.log(color);
        return color;
    }

   
});
/* 

  
*/