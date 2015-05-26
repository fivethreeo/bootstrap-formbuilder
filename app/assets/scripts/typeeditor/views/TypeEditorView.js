
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
            classes: null
        },
        initialize: function(){
          
        }
    });
  typeeditorapp.models.InputType = typeeditorapp.models.BaseType.extend({
        defaults: {
            tag: 'input',
            type: 'text',
            label: 'Label',
            placeholder: null
            choices: null 
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
  typeeditorapp.collections.InputTypeCollection = Backbone.Collection.extend({

        initialize: function(){

        }
    });

  typeeditorapp.views.InputView = Backbone.View.extend({
    template : _.template($('#typeeditor_input_template').html()),
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      this.$el.html(this.template({text:'hello :)  reload'}));
      return this;
    }
  });      

  typeeditorapp.views.InputEditView = Backbone.View.extend({
    template : _.template($('#typeeditor_input_edit_template').html()),
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      return this;
    }
  });
  
  typeeditorapp.views.FormControlView = Backbone.View.extend({
    template : _.template($('#typeeditor_control_template').html()),
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      return this;
    }
  });      

  typeeditorapp.views.FormControlEditView = Backbone.View.extend({
    template : _.template($('#typeeditor_control_edit_template').html()),
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      return this;
    }
  });          
})($);