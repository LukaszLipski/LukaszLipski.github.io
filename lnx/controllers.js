var app = angular.module("app",[]);

var obliczLog = function($scope){

    $scope.oblicz = function() {
        $scope.kolejneKroki = [];
        var x = $scope.a;
        var blad = $scope.b;
        $scope.x = $scope.a;
        $scope.blad = $scope.b;
        var elTablicy;
        var psi,z=0;
        var wynik =0;
        var i= 1,m=0;

        while(x>z){
            z = Math.pow(2,m);
            m++;
        }
        m = m-1;
        z = x/z;

        psi = (1-z)/(1+z);
        wynik = psi;
        $scope.kolejneKroki[0] = psi;
        elTablicy = (Math.pow(psi,2)/(3))*psi;
        while(Math.abs(elTablicy) > (4*blad)){
            elTablicy = (Math.pow(psi,2)/(2*i - 1))*$scope.kolejneKroki[i-1];
            $scope.kolejneKroki[i] = elTablicy;
            wynik += elTablicy;
            i++;
        }

        $scope.wynik = (m*0.69314718056) - (2*wynik);

    }

}

app.controller("obliczLog", obliczLog);