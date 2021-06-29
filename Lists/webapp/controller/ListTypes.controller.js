// @ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("logaligroup.Lists.controller.ListTypes", {
			onInit: function () {
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.loadData("./localService/mockdata/ListData.json");
                this.getView().setModel(oJSONModel);
            },
            
            getGroupHeader: function(oGroup) {
                var groupHeaderListItem = new sap.m.GroupHeaderListItem({
                    title : oGroup.key,
                    upperCase : true
                })

                return groupHeaderListItem;
            },
        
            onShowSelectedRows: function() {

                var standardList = this.getView().byId("standardList");
                var selectedItems = standardList.getSelectedItems();

                var i18nModel = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0) {
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                } else {

                    var textMessage = i18nModel.getText("selection")

                    for (var item in selectedItems) {
                        var context = selectedItems[item].getBindingContext();
                        var oContext = context.getObject();

                        textMessage = textMessage + " - " + oContext.Material;
                    }

                    sap.m.MessageToast.show(textMessage);
                }

            },

            onDeleteSelectedRows: function() {
                var standardList = this.getView().byId("standardList");
                var selectedItems = standardList.getSelectedItems();
                var i18nModel = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0) {
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                } else {

                    var textMessage = i18nModel.getText("selection")
                    var model = this.getView().getModel();
                    var products = model.getProperty("/Products");
                    var arrayId = [];

                    for (var i in selectedItems) {
                        var context = selectedItems[i].getBindingContext();
                        var oContext = context.getObject();
                        arrayId.push(oContext.Id);
                        textMessage = textMessage + " - " + oContext.Material;
                    }

                    //obtenemos los productos no seleccionados
                    products = products.filter(function(p) {
                        return !arrayId.includes(p.Id);
                    })

                    //actualizamos la lista
                    model.setProperty("/Products", products);
                    
                    //se quita la selección de item de la lista que queda después de borrar un item
                    standardList.removeSelections();

                    sap.m.MessageToast.show(textMessage);
                }
            },

            onDeleteRow: function(oEvent) {
                var selectedRow = oEvent.getParameter("listItem");
                var context = selectedRow.getBindingContext();
                var splithPath = context.getPath().split("/");
                //indice del producto seleccionado
                var indexSelectedRow = splithPath[splithPath.length - 1];

                var model = this.getView().getModel();
                var products = model.getProperty("/Products");

                //eliminamos el item seleccionado
                products.splice(indexSelectedRow, 1);

                //actualizamos el modelo en la interfaz de usuario
                model.refresh();

            }

		});
	});
