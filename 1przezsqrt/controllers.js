var app = angular.module("app",[]);

var oblicz1przezx = function($scope){

    $scope.oblicz = function() {
        if($scope.a > 0){
        $scope.kolejneKroki = [];
        var x = $scope.a;
        var blad = $scope.b;
        $scope.x = $scope.a;
        $scope.blad = $scope.b;
        var z=0;
        var i= 2,m=0;

        while(x>z){
            z = Math.pow(2,m);
            m++;
        }
        m = m-1;


        $scope.kolejneKroki[0] = Math.pow(2,-Math.floor(m/2));
        $scope.kolejneKroki[1] = ((3/2)*$scope.kolejneKroki[0]) - ((1/2)*x*Math.pow($scope.kolejneKroki[0],3));

        while(Math.abs($scope.kolejneKroki[i-1]-$scope.kolejneKroki[i-2]) > blad){
            $scope.kolejneKroki[i] = ((3/2)*$scope.kolejneKroki[i-1]) - ((1/2)*x*Math.pow($scope.kolejneKroki[i-1],3));
            i++;
        }

        $scope.wynik = $scope.kolejneKroki[i-1];
        }else{
            $scope.wynik = "x musi byc wiekszy od 0";
        }
    }

}

app.controller("oblicz1przezx", oblicz1przezx);