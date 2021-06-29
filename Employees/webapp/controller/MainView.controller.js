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
            var oView = this.getView();
            // var i18nBundle = oView.getModel("i18n").getResourceBundle();

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
            var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            //el "./" al inicio de la ruta sustituye el namespace logali y la carpeta Employees

            //revisar si los datos se han cargado o no
            // oJSONModel.attachRequestCompleted(function(oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // })

            //asignamos el modelo json a la vista
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

        };

        function onFilter() {

            var oJSONCountries = this.getView().getModel("jsonCountries").getData();

            var filters = [];

            if(oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            } 

            if(oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            } 

            //table refresh
            var oList = this.getView().byId("tableEmployee");
            var oBindig = oList.getBinding("items");
            oBindig.filter(filters);
        };

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };

        function showPostalCode(oEvent) {
           var itemPressed = oEvent.getSource();//item pulsado
           var oContext = itemPressed.getBindingContext("jsonEmployees");
           var objectContext = oContext.getObject();

           sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        // function showOrders(oEvent) {
            
        //     var ordersTable = this.getView().byId("ordersTable");
        //     ordersTable.destroyItems();

        //     var itemPressed = oEvent.getSource();
        //     var oContext = itemPressed.getBindingContext("jsonEmployees");

        //     var objectContext = oContext.getObject();
        //     var orders = objectContext.Orders;

        //     var ordersItems = [];

        //     for (var i in orders) {
        //         ordersItems.push(new sap.m.ColumnListItem({
        //             cells: [
        //                 new sap.m.Label({text: orders[i].OrderID}),
        //                 new sap.m.Label({text: orders[i].Freight}),
        //                 new sap.m.Label({text: orders[i].ShipAddress})
        //             ]
        //         }));
        //     }

        //     var newTable = new sap.m.Table({
        //         width: "auto",
        //         columns: [
        //             new sap.m.Column({header: new sap.m.Label({text: "{i18n>orderID}"})}),
        //             new sap.m.Column({header: new sap.m.Label({text: "{i18n>freight}"})}),
        //             new sap.m.Column({header: new sap.m.Label({text: "{i18n>shipAddress}"})})
        //         ],
        //         items: ordersItems
        //     }).addStyleClass("sapUiSmallMargin");

        //     ordersTable.addItem(newTable);

        //     //Ampliación del HBOX ordersTable
        //     var newTableJSON = new sap.m.Table();
        //     newTableJSON.setWidth("auto");
        //     newTableJSON.addStyleClass("sapUiSmallMargin");

        //     var columnOrderID = new sap.m.Column();
        //     var labelOrderID = new sap.m.Label();
        //     labelOrderID.bindProperty("text","i18n>orderID");
        //     columnOrderID.setHeader(labelOrderID);
        //     newTableJSON.addColumn(columnOrderID);

        //     var columnFreight = new sap.m.Column();
        //     var labelFreight = new sap.m.Label();
        //     labelFreight.bindProperty("text","i18n>freight");
        //     columnFreight.setHeader(labelFreight);
        //     newTableJSON.addColumn(columnFreight);

        //     var columnShipAddress = new sap.m.Column();
        //     var labelShipAddress = new sap.m.Label();
        //     labelShipAddress.bindProperty("text","i18n>shipAddress");
        //     columnShipAddress.setHeader(labelShipAddress);
        //     newTableJSON.addColumn(columnShipAddress);

        //     var columnListItem = new sap.m.ColumnListItem();

        //     var cellOrderID = new sap.m.Label();
        //     cellOrderID.bindProperty("text","jsonEmployees>OrderID");
        //     columnListItem.addCell(cellOrderID);

        //     var cellFreight = new sap.m.Label();
        //     cellFreight.bindProperty("text","jsonEmployees>Freight");
        //     columnListItem.addCell(cellFreight);

        //     var cellShipAddress = new sap.m.Label();
        //     cellShipAddress.bindProperty("text","jsonEmployees>ShipAddress");
        //     columnListItem.addCell(cellShipAddress);

        //     var oBindigInfo = {
        //         model: "jsonEmployees",
        //         path: "Orders",
        //         template: columnListItem
        //     };

        //     newTableJSON.bindAggregation("items", oBindigInfo);
        //     newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

        //     ordersTable.addItem(newTableJSON);
        // };

        function showOrders (oEvent) {
            //get selected controller
            var iconPressed = oEvent.getSource();
            //context from the model
            var oContext = iconPressed.getBindingContext("jsonEmployees");

            //controller attribute
            if (!this._oDialogOrders){
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };

            debugger;

            //Dialog binding to the context to have access to selected item data
            this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
            this._oDialogOrders.open();
              
        };

        function onCloseOrders() {
            this._oDialogOrders.close();
        };

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
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        
        return Main;
    });