// @ts-nocheck
sap.ui.define([
    'sap/ui/core/mvc/Controller'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        'use strict';

        return Controller.extend("logaligroup.Employees.controller.Main", {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("detailEmployeeView");
            },

            onInit: function () {
                var oView = this.getView();

                var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
                oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);

                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                var oJSONModelCountries = new sap.ui.model.json.JSONModel();
                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelLayout = new sap.ui.model.json.JSONModel();
                oJSONModelLayout.loadData("./localService/mockdata/Layout.json", false);
                oView.setModel(oJSONModelLayout, "jsonLayout");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonModelConfig");

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveDataIncidence, this);
                
                this._bus.subscribe("incidence", "onDeleteIncidence", function(channelId, eventId, data) {
                    
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                    this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId + 
                                                                    "',SapId='" + data.SapId +
                                                                    "',EmployeeId='"  + data.EmployeeId + "')", {
                                                                      
                        success: function () {
                            this.onReadOdataIncidence.bind(this)(data.EmployeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                        }.bind(this)
                     });
                }, 
                this);
            },

            showEmployeeDetails: function (category, nameEvent, path) {

                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                //modelo vacío
                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                //limpia el contenido del empleado anterior
                detailView.byId("tableIncidence").removeAllContent();

                this.onReadOdataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
            },

            onSaveDataIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.incidenceRow].IncidenceId == "undefined") {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        Type: incidenceModel[data.incidenceRow].Type
                    };

                    //respuesta del servidor
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            //llamada asincrona
                            this.onReadOdataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {

                    var body = {
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX
                    };

                     this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId + 
                                                                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                                                                    "',EmployeeId='"  + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                                                                      
                        success: function () {
                            this.onReadOdataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                        }.bind(this)
                     });
                }

                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                };
            },

            onReadOdataIncidence: function (employeeID) {
                var empToString = employeeID.toString();

                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", empToString)
                    ],

                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);

                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        };

                    }.bind(this),
                    error: function (e) {

                    }

                });
            }
        });
    });