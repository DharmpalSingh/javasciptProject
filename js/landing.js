var app = angular.module('myLandingApp', []);
app.controller('myLandingCtrl', function ($scope , $http , $window) {
	$scope.scrollShow = false;
	$scope.count =0;
	$scope.showPopUp = false;
	$scope.dataArray =[];
	$scope.cartItemsCount  =0;
	$scope.billShow = false;
	$scope.name = $window.localStorage.getItem('userName');
	$scope.mealTimes = ["After Meal", "Before Meal"];
	$scope.values = ["SOS" , "0 day", "1 day","2 day","3 day","4 day","5 day","6 day" , "1 week" , "2 week","3 week","1 month"];
	$scope.recurrence =["Daily" ,"Weekly" ,"Monthly" , "Yearly"];
	
	// Ajax call function
	$scope.getDataFromAPI = function () {	
		if($scope.searchMedicin.length >2){	
			$scope.scrollShow = true
			$http({
			method : "GET",
			url : "http://52.66.166.33:8080/DawaiBoxSmartPrescription/searchdrugs?Id=14120&SearchText=Para&start=0&limit=10&role=Doctor"
			})
			.then(function mySuccess(response) {
			$scope.myWelcome = response.data;  
			}, function myError(response) {
			$scope.myWelcome = response.statusText;
		});
		}
		else
		{
			$scope.scrollShow = false;	
			$scope.countAjax = 10;
		}
	};
	
	//Delete row function
	$scope.deleteRow = function(drugName)
	{
		$scope.cartItemsCount--;
		$scope.dataArray.forEach(function(obj , index){
			
			if(obj.drugName == drugName)
			{
		
				$scope.dataArray.splice(index, 1);
				$scope.price-=obj.price;
			}	
		})	
	}
	
	// adding row to table function
	$scope.populateTable = function(param)
	{
		$scope.cartItemsCount++;
		// adding new property to response objects
		param.quantityValue = 1;
		param.morning = 1;
		param.noon = 1;
		param.evening = 1;
		param.selectedMealTime =$scope.mealTimes[0];
		param.selectedName = $scope.values[1];
		param.selectedDur = $scope.values[4];
		param.showValue = true;
		param.showEdit = false;
		param.showAdd = false;
		param.recurrenceValue = $scope.recurrence[0];
		// adding object for table row
		$scope.dataArray.unshift(param);
		$scope.scrollShow = false;
		if(param.drugType == "Tablet")
		{
			param.price = 10;
		}
		else
		{
			param.price = 25;
		}
		
		
			if($scope.count>0)
			{
				$scope.dataArray[1].morning = "Mor("+$scope.dataArray[1].morning+")";
				$scope.dataArray[1].noon = "Noon("+$scope.dataArray[1].noon+")";
				$scope.dataArray[1].evening = "Night("+$scope.dataArray[1].evening+")";
				$scope.dataArray[1].showValue= false;
				$scope.dataArray[1].showEdit = true;
				
			}
			$scope.count++;
	}
	
	// below two function are for Information pop up 
	
	$scope.showInfoPopUp = function(infoData)
	{
		$scope.showPopUp = true;
		$scope.infoData = infoData;
	}
	
	$scope.closePopUp = function()
	{
		$scope.showPopUp = false;
	}
	
	
	$scope.editData = function(data)
	{
		
		data.showValue = true;
		data.showAdd = true;
		data.showEdit = false;
		data.morning = data.morning.match(/\d/g).join("");
		data.noon = data.noon.match(/\d/g).join("");
		data.evening = data.evening.match(/\d/g).join("");
			
	}
	$scope.addData = function(data)
	{
		data.showAdd = false;
		data.showEdit = true;
		data.showValue = false;
		
		data.morning = "Mor("+data.morning+")";
		data.noon = "Noon("+data.noon+")";
		data.evening = "Night("+data.evening+")";
	}
	
	$scope.calculateTotalBill = function()
	{
		$scope.price = 0;
		$scope.billShow = true;
		$scope.totalQuantity =0;
		$scope.dataArray.forEach(function(item){
			
			$scope.price+=parseInt(item.quantityValue)*item.price;
			$scope.totalQuantity+= parseInt(item.quantityValue);
			
		})
	}
	
});

//Directive for scroll event  
app.directive('scroll', ['$http' , 'appService' ,function($http, appService) {
  return {
		link: function (scope, elem, attrs) {
		elem.on('scroll', function (e) {
		var total = scope.myWelcome.totalCount
	
		appService
			.getData(total)
			.then(function (responseData) {
							scope.myWelcome.drugList.push.apply(scope.myWelcome.drugList, responseData.drugList);
			})
			.catch(function(err)
			{
				return;	
			});
      });
    }
  }
}]);


// directive for taking only numbers
app.directive('onlyNumbers', function () {
    return  {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                if(event.shiftKey){event.preventDefault(); return false;}
                //console.log(event.which);
                if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    // backspace, enter, escape, arrows
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers 0 to 9
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // number pad number
                    return true;
                } 
                else if ([110, 190].indexOf(event.which) > -1) {
                //    // dot and numpad dot
                     return true;
                 }
                else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});


// service used to getting ajax data on scroll
app.service('appService' , function($http)
{
	this.countAjax = 10;
	this.limit = 10;
    this.getData =  function(totalCount) {
					if(	this.countAjax < totalCount){
					return $http.get("http://52.66.166.33:8080/DawaiBoxSmartPrescription/searchdrugs?Id=14120&SearchText=Para&start="+this.countAjax+"&limit="+this.limit+"&role=Doctor")
					.then(function mySuccess(response) {
							this.countAjax+=10;
								if(totalCount-this.countAjax<10){
								limit = totalCount-this.countAjax;
								}
					 return response.data;	
		})
		
		}
    }
	
});


//filter value 
app.filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        angular.forEach(arr, function(item){
            if(item.drugName.toLowerCase().indexOf(searchString) == 0){
            result.push(item);
        }
        });
        return result;
    };
});
