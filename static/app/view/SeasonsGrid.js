/*
 * File: app/view/SeasonsGrid.js
 * Date: Sun Sep 11 2011 23:18:22 GMT+0200 (CEST)
 *
 * This file was generated by Ext Designer version 1.2.0.
 * http://www.sencha.com/products/designer/
 *
 * This file will be generated the first time you export.
 *
 * You should implement event handling and custom methods in this
 * class.
 */

Ext.define('TvSeries.view.SeasonsGrid', {
    extend: 'TvSeries.view.ui.SeasonsGrid',
    alias: 'widget.SeasonsGrid',

    serial: null,
        
    filterTask:  null,

    initComponent: function() {
        var me = this;
        me.callParent(arguments);
		
        this.down("#addSeasonButton").on("click", this.addSeason, this);
		
        this.getSelectionModel().on('select', this.select, this);
        this.down("textfield").on('change', this.search, this);
		
        this.on('reload', this.reload, this);
                
        this.filterTask = new Ext.util.DelayedTask(this.executeSearch, this);
    },
	
    load: function(serial, callback, callbackScope){
        this.serial = serial;
		
        this.getStore().getProxy().extraParams = {
            idSerial: this.serial.data.id
        };
        
        var loadParams = {};
        if(callback !== undefined && callbackScope !== undefined)
            loadParams = {
                scope: callbackScope,
                callback: function(){
                    callback.apply(callbackScope, []);
                }
            };
        this.getStore().load(loadParams);
        
        this.setTitle("2. " + serial.data.title);
    },
	
    reload: function(){
        this.filterTask.cancel();
        this.load(this.serial);
    },
	
    select: function(sm, season, index, opt){
        this.filterTask.cancel();
        this.fireEvent("loadEpisode", this.serial, season);
    },
	
    addSeason: function(){
        var addwindow = Ext.create('TvSeries.view.AddSeasonWindow', {
            renderTo: Ext.getBody()
        });
        addwindow.down("#idSerialField").setValue(this.serial.data.id);
        addwindow.show();
        addwindow.on("close", this.reload, this);
    },
	
    search: function(){
        this.filterTask.delay(200);
    },
        
    executeSearch: function(){
        var value = this.down("textfield").getValue();
        this.getStore().getProxy().extraParams = {
            idSerial: this.serial.data.id,
            title: value
        };
        this.getStore().load();            
    }        
});