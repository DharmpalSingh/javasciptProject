var app = angular.module('myWebApp', []);
app.controller('logInCtrl',['$scope' , '$window' , function ($scope , $window ) {
	$scope.sendForm = function () {
	$scope.msg = "Form Validated";
		};
	$window.localStorage.setItem('userName',"Dharmapal" );
	$window.localStorage.setItem('userEmail',"dharmapal.ece@gmail.com" );
	$window.localStorage.setItem('userPass',"abc@123" );
	
	$scope.validateUser = function()
	{
		
		var email = $window.localStorage.getItem('userEmail');
		var passworda = $window.localStorage.getItem('userPass')	
		 
		if($scope.txtmail == email && $scope.passValue == passworda)
		{
			$window.location = 'landing.html';
		}
		
	}
	
	
}]);