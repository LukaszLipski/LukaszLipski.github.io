var app = angular.module("app",[]);

var obliczPierw = function($scope){

    $scope.oblicz = function() {
        if($scope.a > 0){
        $scope.kolejneKroki = [];
        var x = $scope.a;
        var blad = $scope.b;
        $scope.x = $scope.a;
        $scope.blad = $scope.b;
        var i= 2,m=0,z=0;

        while(x>z){
            z = Math.pow(2,m);
            m++;
        }
        m = m-1;

        $scope.kolejneKroki[0] = Math.pow(2,(m/2));
        $scope.kolejneKroki[1] = (1/2)*($scope.kolejneKroki[0]+(x/$scope.kolejneKroki[0]));

        while(Math.abs($scope.kolejneKroki[i-1]-$scope.kolejneKroki[i-2]) > blad){
            $scope.kolejneKroki[i] = (1/2)*($scope.kolejneKroki[i-1]+(x/$scope.kolejneKroki[0]));
            i++;
        }

        $scope.wynik = $scope.kolejneKroki[i-1];
        }else{
            $scope.wynik = "x musi byc wiekszy od 0";
        }
    }

}

app.controller("obliczPierw", obliczPierw);