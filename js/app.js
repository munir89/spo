(function () {
  'use strict';

  angular
    .module('PosApp', [])
    .controller('DataAddController', DataAddController)
    .controller('ShowDataController', ShowDataController)
    .service('DataService', DataService)
    .service('DataPosService', DataPosService);

  /** @ngInject */
  DataAddController.$inject = ["DataService"]
  function DataAddController(DataService) {
    var dataAdd = this;
    dataAdd.name = "";
    dataAdd.age = "";
    dataAdd.show = true;
    // Add name and age to person data on click show my healty button
    dataAdd.showMyHealtyStatus = function () {
      dataAdd.show = false;
      DataService.addData(dataAdd.name, dataAdd.age);

    };

  }

  // Show Controller function
  ShowDataController.$inject = ['DataService'];
  function ShowDataController(DataService) {
    var showData = this;
    // get person data
    showData.person = {
      name: "",
      age: "",
      time: "",
      date: "",
      hr: "",
      pso: ""
    };
    showData.person = DataService.getDate();



    showData.exportData = function () {
      var data = [];
      data.push(showData.person);
      /* generate a worksheet */
      var ws = XLSX.utils.json_to_sheet(data);

      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Presidents");

      /* write workbook and force a download */
      XLSX.writeFile(wb, "sheetjs.xlsx");
    };
  }

  // Service for request data data 
  DataService.$inject = ['$filter', 'DataPosService'];
  function DataService($filter, DataPosService) {
    var service = this;
    var person = {
      name: "",
      age: "",
      time: "",
      date: "",
      hr: "",
      pso: ""
    };

    // Ddd data to person Method
    service.addData = function (name, age) {
      var promise = DataPosService.getPosData();
      promise.then(function (data) {
        var wb = XLSX.read(data.data, { type: "array" });
        var d = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        var today = new Date();
        person.name = name;
        person.age = age;
        person.time = $filter('date')(today, 'h:mma');
        person.date = $filter('date')(today, 'MM/dd/yyyy');
        person.pso = d[0].pso;
        person.hr = d[0].hr;
      }, function (err) { console.log(err); });

    };

    // Get data person
    service.getDate = function () {
      return person;
    };
  }

  // Service for get POS data from Excel file

  DataPosService.$inject = ['$http'];
  function DataPosService($http) {
    var service = this;

    service.getPosData = function () {
      var response = $http({
        method: 'GET',
        url: 'data/SPO2.xlsx',
        responseType: 'arraybuffer'
      });

      return response;
    };

  }
}());