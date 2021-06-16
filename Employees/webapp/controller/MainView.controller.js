// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     *  
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            var oJSONModel = new sap.ui.model.json.JSONModel();
            var oView = this.getView();
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            // //carga manual de datos en modelo json
            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "US",
            //     listCountry: [
            //         {
            //             key: 'US',
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: 'UK',
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: 'ES',
            //             text: i18nBundle.getText("countryES")
            //         },                    
            //     ]

            // };

            //asignamos los datos al modelo json
            // oJSONModel.setData(oJSON);
            oJSONModel.loadData("./localService/mockdata/Employees.json", false);
            //el "./" al inicio de la ruta sustituye el namespace logali y la carpeta Employees

            //revisar si los datos se han cargado o no
            // oJSONModel.attachRequestCompleted(function(oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // })

            //asignamos el modelo json a la vista
            oView.setModel(oJSONModel);
        }

        function onFilter() {

            var oJSON = this.getView().getModel().getData();

            var filters = [];

            if(oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            } 

            if(oJSON.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            } 

            //table refresh
            var oList = this.getView().byId("tableEmployee");
            var oBindig = oList.getBinding("items");
            oBindig.filter(filters);
        }

        function onClearFilter() {
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        }

        function showPostalCode(oEvent) {
           var itemPressed = oEvent.getSource();//item pulsado
           var oContext = itemPressed.getBindingContext();
           var objectContext = oContext.getObject();

           sap.m.MessageToast.show(objectContext.PostalCode);
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                // inputEmployee.setDescription("Ok");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);

            } else {
                // inputEmployee.setDescription("Not Ok");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        
        return Main;
    });