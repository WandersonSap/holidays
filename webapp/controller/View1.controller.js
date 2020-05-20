sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/suite/ui/commons/TimelineItem",
    "sap/ui/core/Item"
], function (Controller, TimelineItem, Item) {
    "use strict";

    return Controller.extend("ovly.holidays.controller.View1", {

        endPoint: "https://calendarific.com/api/v2/holidays",
        api_Key: "581c2cce07c9846e1c30c1655ad72ccdfd23c5cfeb5b79fd12c978f9686ec96a",

        onInit: function () {

            this._page = this.byId("page");
            this._select = this.byId("select");
            this._datePicker = this.byId("datepicker");
            this._timeline = this.byId("timeline");

            this._fillSelect();
            
            
        },

        onSearch: function () {
        	this._page.setBusy(true);
            $.get(this.endPoint, this._getParameters(), function (oResponse) {
                this._refreshTimeline(oResponse.response.holidays);
                this._page.setBusy(false);
            }.bind(this));
        },


        _fillSelect: function () {
            var sPath = sap.ui.require.toUrl("ovly/holidays/model/countries.json");
            $.get(sPath, function (aCountries) {
                $.each(aCountries, function (index, oCountry) {
                    var oNewItem = new Item({
                        key: oCountry.id,
                        text: oCountry.name
                    });
                    this._select.addItem(oNewItem);
                }.bind(this));
            }.bind(this));
        },

        _getParameters: function () {
            return {
                api_key: this.api_Key,
                country: this._select.getSelectedKey(),
                year: this._datePicker.getDateValue().getFullYear()
            };
        },

        _refreshTimeline: function (aHolidays) {
            this._timeline.removeAllContent();

            jQuery.each(aHolidays, function (index, element) {
                var oTimelineItem = new TimelineItem({
                    dateTime: element.date.iso,
                    title: element.name,
                    text: element.description,
                    icon: "sap-icon://date-time",
                });

                this._timeline.addContent(oTimelineItem);
            }.bind(this));
        }


    });
});