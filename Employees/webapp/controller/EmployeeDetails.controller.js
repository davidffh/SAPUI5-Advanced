sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'logaligroup/Employees/model/formatter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter) {
        'use strict';

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onCreateIncidence() {

            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var oData = incidenceModel.getData();
            var index = oData.length;
            oData.push({ index: index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);

        };

        function onDeleteIncidence(oEvent) {

            // este código ya no se va a usar, ya que solo elimina
            // desde la interfaz de usuario no desde el servidor del backend
            // var tableIncidence = this.getView().byId("tableIncidence");
            // var rowIncidence = oEvent.getSource().getParent().getParent();
            // var incidenceModel = this.getView().getModel("incidenceModel");
            // var oData = incidenceModel.getData();
            // var contextObj = rowIncidence.getBindingContext("incidenceModel");

            // oData.splice(contextObj.index - 1, 1);

            // for (var i in oData) {
            //     oData[i].index = parseInt(i) + 1;
            // };

            // incidenceModel.refresh();
            // tableIncidence.removeContent(rowIncidence);

            // for (var j in tableIncidence.getContent()) {
            //     tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
            // };

            var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", {
                IncidenceId: contextObj.IncidenceId,
                SapId: contextObj.SapId,
                EmployeeId: contextObj.EmployeeId
            });
        };

        function onSaveIncidence(oEvent) {

            var incidence = oEvent.getSource().getParent().getParent();
            //  valor
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            //                                                  atributo       valor asignado
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace("/", "") })

        };

        function updateIncidenceCreationDate(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.creationDateX = true;
        };

        function updateIncidenceReason(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.ReasonX = true;
        };

        function updateIncidenceType(oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.TypeX = true;
        };

        var EmployeeDetails = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
        EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
        EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
        EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
        EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
        return EmployeeDetails;

    });