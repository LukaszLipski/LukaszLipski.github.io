var app = angular.module("app",[]);

var obliczSin = function($scope){

    $scope.oblicz = function() {
        $scope.kolejneKroki = [];
        var kat = $scope.a;
        var blad = $scope.b;
        $scope.kat = $scope.a;
        $scope.blad = $scope.b;
        var elTablicy;
        var wynik = kat;
        var i=1; // licznik kolejnych operacji w petli while

        $scope.kolejneKroki[0] = kat;
        elTablicy = (-Math.pow(kat,2)/6)*kat;
        while(Math.abs(elTablicy) >= blad){
            elTablicy = (-Math.pow(kat,2)/((2*i)*(2*i + 1)))*$scope.kolejneKroki[i-1];
            $scope.kolejneKroki[i] = elTablicy;
            wynik += elTablicy;
            i++;
        }

        $scope.wynik = wynik;

    }

}


var obliczCos = function($scope){

    $scope.oblicz = function() {
        $scope.kolejneKroki = [];
        var kat = $scope.a;
        var blad = $scope.b;
        $scope.kat = $scope.a;
        $scope.blad = $scope.b;
        var elTablicy;
        var wynik =1;
        var i=1; // licznik kolejnych operacji w petli while

        $scope.kolejneKroki[0] = 1;
        elTablicy = (Math.pow(-(kat),2)/2)*kat;
        while(Math.abs(elTablicy) >= blad){
            elTablicy = (-Math.pow(kat,2)/((2*i)*(2*i - 1)))*$scope.kolejneKroki[i-1];
            $scope.kolejneKroki[i] = elTablicy;
            wynik += elTablicy;
            i++;
        }

        $scope.wynik = wynik;

    }

}

app.controller("obliczSin", obliczSin);
app.controller("obliczCos", obliczCos);