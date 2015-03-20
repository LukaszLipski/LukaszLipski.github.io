var app = angular.module("app",[]);

var obliczPotegeE = function($scope){

    $scope.oblicz = function() {
        $scope.kolejneKroki = [];
        var potega = $scope.a;
        var blad = $scope.b;
        $scope.potega = $scope.a;
        $scope.blad = $scope.b;
        var elTablicy;
        var wynik =1;
        var i=1; // licznik kolejnych operacji w petli while

        $scope.kolejneKroki[0] = 1;
        elTablicy = (potega/1)*1;
        while(Math.abs(elTablicy) > blad){
            elTablicy = (potega/i)*$scope.kolejneKroki[i-1];
            $scope.kolejneKroki[i] = elTablicy;
            wynik += elTablicy;
            i++;
        }

        $scope.wynik = wynik;

    }

}

app.controller("obliczPotegeE", obliczPotegeE);