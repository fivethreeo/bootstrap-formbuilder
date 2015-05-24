
(function($){
  'use strict';
  typeeditorapp.views.TypeEditorView = Backbone.View.extend({
    el : $('.backbone'),
    template : _.template('<p><%= text %></p>'),
    events : {
    },
    initialize : function(){
      _.bindAll(this, 'render');

       this.render();
    },
    render : function(){
      this.$el.html(this.template({text:'hello :) reload'}));
      return this;
    }
  });
  
  var TypeEditor = new typeeditorapp.views.TypeEditorView();
})($);