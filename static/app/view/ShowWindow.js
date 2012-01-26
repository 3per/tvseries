/*
 * File: app/view/ShowWindow.js
 * Date: Mon Sep 12 2011 00:07:28 GMT+0200 (CEST)
 *
 * This file was generated by Ext Designer version 1.2.0.
 * http://www.sencha.com/products/designer/
 *
 * This file will be generated the first time you export.
 *
 * You should implement event handling and custom methods in this
 * class.
 */
Ext.define('ShowWindowModel', {
    extend: 'Ext.data.Model',
    fields: [
    {
        name: 'SerialTitle',  
        type: 'string'
    },

    {
        name: 'SeasonTitle',  
        type: 'string'
    },

    {
        name: 'EpisodeTitle',  
        type: 'string'
    },

    {
        name: 'EpisodePremier',  
        type: 'string'
    },

    {
        name: 'EpisodeAbout',  
        type: 'string'
    }
    ]
});

Ext.define('TvSeries.view.ShowWindow', {
    extend: 'TvSeries.view.ui.ShowWindow',
    idEpisode: null,
    
    videoPlayer: null,
    
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        
        var availability = this.down("form").getForm().findField("availability");
        availability.on('select', this.availabilityChanged, this);
        
        this.on('hide', this.stopVideo, this);
        this.on('afterrender', this.getVideoPlayer, this);
    },
    
    getVideoPlayer: function(){
        this.videoPlayer = Ext.get('videoplayer').dom;
    },
    
    loadVideo: function(episodeRecord, seasonRecord, serialRecord){
        
        if(seasonRecord == null){
            this.close();
            return;
        }
    	
        this.idEpisode = episodeRecord.get('id');
    	
        var serialTitle = serialRecord.get('title');
        var serialTitle_ = serialTitle.replace(/ /gi,"_");
    	
        var seasonTitle = seasonRecord.get('title');
        var seasonTitle_ = seasonTitle.replace(/ /gi,"_");

        var seasonNumber = seasonRecord.get('number');
        console.info(seasonNumber);
        if(seasonNumber <= 9){
            seasonNumber = "0" + seasonNumber;
        }

        var episodeNumber = episodeRecord.get('number');
        if(episodeNumber <= 9){
            episodeNumber = "0" + episodeNumber;
        }
    	
        var availability = episodeRecord.get('availability');
        switch(availability){
            case 'not':
                availability = 1;
                break;
            case 'processing':
                availability = 2;
                break;
            case 'low':
                availability = 3;
                break;
            case 'middle':
                availability = 4;
                break;
            case 'high':
                availability = 5;
                break;
        }
        console.info(availability);
        var rec = Ext.ModelManager.create({
            SerialTitle: serialTitle,
            SeasonTitle: seasonTitle,
            EpisodeTitle: episodeRecord.get('title'),
            EpisodePremier: episodeRecord.get('premier'),
            EpisodeAbout: episodeRecord.get('about'),
            availability: availability
        }, 'ShowWindowModel');
    	
        this.down("form").loadRecord(rec);
        
        var BroadcastTimeGrid = this.down("#BroadcastTimeGrid");
        var BroadcastStore = BroadcastTimeGrid.getStore();
        BroadcastStore.getProxy().extraParams = {
            idEpisode: episodeRecord.get('id')
        };
        BroadcastStore.load();
        BroadcastTimeGrid.on("itemdblclick", this.click, this);
        
        // Loading the Video into Videoplayer and start!
	var videourl = "http://c-ha.dyndns.org/tvseries/media/"+serialTitle_+"/"+seasonTitle_+"/"+seasonNumber+"x"+episodeNumber;
        this.videoPlayer.playlist.add(videourl);
        this.videoPlayer.playlist.play();
        
        this.show();
    },
	
    click: function(view, rec, item, index, e, eOpts){
        //Öffne neues Fenster mit Link zu otrkeyfinder
		
        var channel = rec.data.channel;
		
        var time = new Date(rec.data.time);
        var otrtime = Ext.Date.format(time, "y.m.d_H-i");
		
        var url = channel + "%20" + otrtime;
        url = "http://otrkeyfinder.com/?search=" + url;
		
        window.open(url, otrtime, null, null);
    },
	
    availabilityChanged: function(combobox, recs, eOpts){
        //speichere neue auswahl ab!
        var idEpisode = this.idEpisode;
        var idAvailability = recs[0].data.idAvailability;
        Ext.Ajax.request({
            scope: this,
            url : '../dynamic/?callName=UpdateEpisodes',
            params: {
                idEpisode: idEpisode,
                availability: idAvailability
            },
            success: function(response){
                var responseObj = Ext.JSON.decode(response.responseText);
                if(!responseObj.success){
                    Ext.Msg.alert("Fehler beim Aktualisieren der Daten.", responseObj.errorInfo);
                }
            }
        });
    },
    
    stopVideo: function(){
        this.videoPlayer.playlist.stop();
        this.videoPlayer.playlist.items.clear();
    }
});