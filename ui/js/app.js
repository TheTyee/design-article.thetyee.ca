App.Story = Backbone.Model.extend({
    defaults: {
        "title": "‘Perfect Storm’ Engulfing Canada’s Economy Perfectly Predictable",
        "byline": "Jane Doe",
        "bio": "Jane Doe's bio is coming...",
        "category": "CATEGORY",
        "date": "Calculating date..."
    },
    initialize: function(){
    },
    urlRoot: 'http://api.thetyee.ca/v1/search/path/',
    parse: function(response, options) {
        var d = response.hits.hits[0]._source;
        return {
            "title": d.title,
            "teaser": d.teaser,
            "byline": d.byline,
            "bio": d.author_info[0],
            "section": d.section.toUpperCase(),
            "date": moment(d.storyDate).fromNow()
        };
    },
    url: function() {
        return this.urlRoot + this.id;
    },
});

App.StoryView = Backbone.View.extend({
    el: 'body',
     bindings: {
        '[data-bind="title"]': 'title',
        '[data-bind="teaser"]': 'teaser',
        '[data-bind="author-name"]': 'byline',
         '[data-bind="author-bio"]': {
          observe: 'bio',
          updateMethod: 'html',
          escape: false 
        },
        '[data-bind="category"]': 'section',
        '[data-bind="date"]': 'date'

    },
  render: function() {
    this.stickit();
  }
});

App.Stories = Backbone.Collection.extend({
    model: App.Story,
    //url: App.apiUrl + '/api/v1/businesses',
    parse: function(response, options) {
        //return response.data.businesses;
    }
});

// http://api.thetyee.ca/v1/search/path/Opinion/2016/03/12/Trudeau-Fixing-Harper-Sham/


App.Router = Backbone.Router.extend({
    initialize: function() { 
    },
    routes: {
        "":         "showFront",
        "*path":    "storyShow"
    },
    storyShow: function(path, mode) {
        App.story = new App.Story({ "id": path });
        App.storyView = new App.StoryView({ "model": App.story });
        App.storyView.render();
        App.story.fetch();
    }
});
