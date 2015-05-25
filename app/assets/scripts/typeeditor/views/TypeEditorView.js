
(function($){
  'use strict';
  typeeditorapp.views.TypeEditorView = Backbone.View.extend({
    el : $('.backbone'),
    template : _.template($('#typeeditor_main_template').html()),
    events : {
      'click .nav li a': 'activateTab'
    },
    initialize : function(){
      _.bindAll(this, 'render', 'activateTab');

       this.render();
    },
    render : function(){
      this.$el.html(this.template({}));
      return this;
    },
    activateTab : function(event){
      $(event.currentTarget).tab('show');
    }
  });
  
  var TypeEditor = new typeeditorapp.views.TypeEditorView();
  
  typeeditorapp.models.BaseType = Backbone.Model.extend({
        defaults: {
            size_xs: null,
            size_sm: null,
            size_md: null,
            size_lg: null,
            classes: null,
            tag: null
        },
        initialize: function(){
          
        }
    });
  typeeditorapp.models.InputType = typeeditorapp.models.BaseType.extend({
        defaults: {
            tag: 'input',
            type: 'text'
        },
        
        get_classes: function() {
          var that = this;
          var keys = ['size_xs', 'size_sm',' size_md', 'size_lg', 'classes'];
          var classes = _.map(keys, function(key) { 
            return that.get(key);
          });
          return _.compact(classes).join(' ');
        },
         
        initialize: function(){

        }
    });

  typeeditorapp.views.InputView = Backbone.View.extend({
    template : _.template($('#typeeditor_input_template').html()),
    events : {
      'click .nav li a': 'activateTab'
    },
    initialize : function(){
      _.bindAll(this, 'render', 'activateTab');

       this.render();
    },
    render : function(){
      this.$el.html(this.template({text:'hello :)  reload'}));
      return this;
    }
  });      
  
})($);