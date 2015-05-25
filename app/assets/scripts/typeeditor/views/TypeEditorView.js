
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
      this.$el.html(this.template({text:'hello :)  reload'}));
      return this;
    },
    activateTab : function(event){
      $(event.currentTarget).tab('show');
    }
  });
  
  var TypeEditor = new typeeditorapp.views.TypeEditorView();
})($);