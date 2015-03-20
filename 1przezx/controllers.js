var app = angular.module("app",[]);

var oblicz1przezx = function($scope){

    $scope.oblicz = function() {
        if($scope.a > 0){
        $scope.kolejneKroki = [];
        var x = $scope.a;
        var blad = $scope.b;
        $scope.x = $scope.a;
        $scope.blad = $scope.b;
        var elTablicy,elTablicy2;
        var psi,z=0;
        var wynik =0;
        var i= 2,m=0;

        while(x>z){
            z = Math.pow(2,m);
            m++;
        }
        m = m-1;
        z = x/z;

        psi = (1-z)/(1+z);
        wynik = Math.pow(2,-m);
        $scope.kolejneKroki[0] = Math.pow(2,-m);
        $scope.kolejneKroki[1] = Math.pow(2,-m)*(2-(x*Math.pow(2,-m)));
        elTablicy = $scope.kolejneKroki[0];
        elTablicy2 = $scope.kolejneKroki[1];
        while(Math.abs($scope.kolejneKroki[i-1]-$scope.kolejneKroki[i-2]) > blad){
            $scope.kolejneKroki[i] = $scope.kolejneKroki[i-1]*(2-(x*$scope.kolejneKroki[i-1]));
            i++;
        }

        $scope.wynik = $scope.kolejneKroki[i-1];
        }else{
            $scope.wynik = "x musi byc wiekszy od 0";
        }
    }

}

app.controller("oblicz1przezx", oblicz1przezx);