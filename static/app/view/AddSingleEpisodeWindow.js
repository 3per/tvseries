/*
 * File: app/view/AddSingleEpisodeWindow.js
 *
 * This file was generated by Ext Designer version 1.2.2.
 * http://www.sencha.com/products/designer/
 *
 * This file will be generated the first time you export.
 *
 * You should implement event handling and custom methods in this
 * class.
 */

Ext.define('TvSeries.view.AddSingleEpisodeWindow', {
	extend: 'TvSeries.view.ui.AddSingleEpisodeWindow',

	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		this.down("#saveButton").on("click", this.save, this);
		this.down("#serialCombobox2").on("change", this.loadSeason, this);
	},
	
	save: function(){
		console.info("save");
		this.down("form").getForm().submit({
			params: {
				action: "updateoraddSingle"
			},
			success: function(form, action) {
				Ext.Msg.alert('Erfolgreich gespeichert', "Änderungen erfolgreich gespeichert.<br />" + action.result.msg);
				this.close();
			},
			failure: function(form, action) {
				Ext.Msg.alert('Es ist ein Fehler aufgetreten', action.result.msg);
			},
			scope: this
		});
	},
	
	loadSeason: function(){
		var idSerial = this.down("#serialCombobox2").getValue();
		this.down("#seasonCombobox2").getStore().getProxy().extraParams = {
			idSerial: idSerial
		};
		this.down("#seasonCombobox2").getStore().load();
	}
});