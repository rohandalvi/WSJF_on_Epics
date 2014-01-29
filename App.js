Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        //Write app code here
        Ext.state.Manager.setProvider(
            new Ext.state.CookieProvider({ expires: new Date(new Date().getTime()+(10006060247)) })
        );

        app = this;
        var that = this;
        console.log("launch");
        // get the project id.
        this.project = this.getContext().getProject().ObjectID;
		this.workspace = this.getContext().getWorkspace().ObjectID;
		
		Ext.create('Rally.data.WsapiDataStore',{
			model: 'PortfolioItem/Feature',
			fetch: ['FormattedID','Name','UserStories'],
			autoLoad: true,
			listeners: {
				load: this._onDataLoaded,
				scope:this
			}
		});
     },
     _onDataLoaded: function(store,data){
     	var features = [];
     	var pendingstories = data.length;
     	var owner;
     	Ext.Array.each(data,function(feature){
     		var f = {
     			FormattedID: feature.get('FormattedID'),
     			Name: feature.get('Name'),
     			_ref: feature.get("_ref"),
     			StoryCount: feature.get('UserStories').Count,
     			UserStories: []
     		};
     		var stories = feature.getCollection('UserStories');
     		stories.load({
     			fetch: ['FormattedID','Owner','PlanEstimate'],
     			callback: function(records,operation,success){
     				Ext.Array.each(records,function(story){
     					f.UserStories.push({_ref: story.get('_ref'),
     					FormattedID: story.get('FormattedID'),
     					Owner: (story.get('Owner') && story.get('Owner')._refObjectName) || 'None',
     					EstCP: story.get('PlanEstimate')});
     				},this);
     				--pendingstories;
     				if(pendingstories==0){
     					story = [];
     					for(var i=0;i<features.length;i++){
     						if(features[i].UserStories!=null && features[i].UserStories!="" && features[i].UserStories!==undefined)
     						story[i]=features[i].UserStories;
     					
     					}
     					console.log('Stories are ',story);
     					
     				}
     			},
     			scope:this
     		});
     		features.push(f);
     	},this);
     }
    
});
