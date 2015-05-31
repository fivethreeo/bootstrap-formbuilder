
(function($){
  'use strict';

  typeeditorapp.models.BaseType = Backbone.Model.extend({
    defaults: {
      tag: 'div',
      col_xs: null,
      col_sm: null,
      col_md: null,
      col_lg: null,
      classes: null
    },
    
    initialize: function(){
      
    },
    
    get_combined: function(keys){
      var that = this;
      var classes = _.map(keys, function(key) { 
        return that.get(key);
      });
      return _.compact(classes).join(' ');
      
    },

    get_classes: function() {
      return this.get_combined([
        'col_xs', 'col_sm', 'col_md', 'col_lg',
        'classes']);
    }
    
  });
  
  typeeditorapp.models.InputBaseType = typeeditorapp.models.BaseType.extend({
    defaults: {
      name: 'name',
      size: null,
      add_on_before: null,
      add_on_after: null
    },
    
    initialize: function(){

    },
    get_classes: function() {
      return this.get_combined([
        'size',
        'col_xs', 'col_sm', 'col_md', 'col_lg',
        'classes']);
    }
  });  
  typeeditorapp.models.InputType = typeeditorapp.models.InputBaseType.extend({
    defaults: {
      tag: 'input',
      type: 'text',
      placeholder: null
    },
    
    initialize: function(){

    }
  });  
  typeeditorapp.models.InputChoiceType = typeeditorapp.models.InputBaseType.extend({
    defaults: {
      tag: 'select',
      choices: null
    },
    
    initialize: function(){

    }

  });
  typeeditorapp.collections.InputTypeCollection = Backbone.Collection.extend({

    initialize: function(){

    }
  });
  typeeditorapp.models.FormControlType = typeeditorapp.models.BaseType.extend({
    defaults: {
      label: 'Label',
      input: null
    },

    initialize: function(){

    }
  });
  typeeditorapp.collections.FormControlCollection = Backbone.Collection.extend({

    initialize: function(){

    }
  });
  typeeditorapp.models.FormType = typeeditorapp.models.BaseType.extend({
    defaults: {
    },
    
    initialize: function(){

    }
  });
  typeeditorapp.views.InputView = Backbone.View.extend({
    template : _.template(templates.typeeditor_input_template||''),
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
    template : _.template(templates.typeeditor_input_edit_template||''),
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
    template : _.template(templates.typeeditor_formcontrol_template||''),
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
    template : _.template(templates.typeeditor_formcontrol_edit_template||''),
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
  
  typeeditorapp.views.FormView = Backbone.View.extend({
    template : _.template(templates.typeeditor_form_template||''),
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

  typeeditorapp.views.FormEditView = Backbone.View.extend({
    template : _.template(templates.typeeditor_form_edit_template||''),
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
  
  typeeditorapp.views.TypeEditorView = Backbone.View.extend({
    el : $('.backbone'),
    template : _.template(templates.typeeditor_main_template),
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
      
})(jQuery);